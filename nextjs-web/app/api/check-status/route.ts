import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/service-role';
import AdmZip from 'adm-zip';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const KIRI_BASE_URL = 'https://api.kiriengine.app/api';
const KIRI_API_KEY = process.env.KIRI_API_KEY;
const BLENDER_SERVICE_URL = process.env.BLENDER_SERVICE_URL;

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const taskId = searchParams.get('taskId');

        if (!taskId) {
            return NextResponse.json({ status: 'failed', error: 'Task ID is required' });
        }

        if (!KIRI_API_KEY) {
            console.error('[CheckStatus] KIRI_API_KEY missing');
            return NextResponse.json({ status: 'failed', error: 'Server configuration error: KIRI_API_KEY missing' });
        }

        console.log(`[CheckStatus] Checking task: ${taskId}`);

        // 1. Check Kiri Status
        const statusRes = await fetch(`${KIRI_BASE_URL}/task/${taskId}`, {
            headers: { 'Authorization': `Bearer ${KIRI_API_KEY}` },
        });

        if (!statusRes.ok) {
            const errorText = await statusRes.text();
            console.error(`[CheckStatus] Kiri API error: ${statusRes.status}`, errorText);
            return NextResponse.json({ status: 'failed', error: `Kiri API error: ${statusRes.status} - ${errorText}` });
        }

        const statusData = await statusRes.json();
        console.log(`[CheckStatus] Kiri response:`, JSON.stringify(statusData));

        const kiriStatus = statusData.data?.status || statusData.status;
        console.log(`[CheckStatus] Parsed status: ${kiriStatus}`);

        if (kiriStatus === 'done' || kiriStatus === 'succeeded') {
            console.log('[CheckStatus] Task done. Checking DB for existing record...');

            // Check if we already processed it to avoid re-doing work
            const { data: existingRecord, error: dbError } = await supabaseAdmin
                .from('generated_models')
                .select('status, model_url')
                .eq('kiri_task_id', taskId)
                .single();

            if (dbError && dbError.code !== 'PGRST116') { // Ignore 'not found' error
                console.error('[CheckStatus] DB Error:', dbError);
            }

            if (existingRecord?.status === 'ready' && existingRecord?.model_url) {
                console.log('[CheckStatus] Model already ready in DB.');
                return NextResponse.json({ status: 'ready', modelUrl: existingRecord.model_url });
            }

            // Download result from Kiri
            const resultUrl = statusData.data?.result || statusData.result;
            if (!resultUrl) {
                console.error('[CheckStatus] No result URL in Kiri response');
                return NextResponse.json({ status: 'failed', error: 'Task done but no result URL found' });
            }

            console.log('[CheckStatus] Downloading result from Kiri:', resultUrl);
            const resultRes = await fetch(resultUrl);
            if (!resultRes.ok) {
                console.error(`[CheckStatus] Failed to download result: ${resultRes.status}`);
                return NextResponse.json({ status: 'failed', error: `Failed to download result: ${resultRes.status}` });
            }

            const resultBuffer = Buffer.from(await resultRes.arrayBuffer());
            console.log(`[CheckStatus] Downloaded ${resultBuffer.length} bytes`);

            // Extract GLB from ZIP
            let glbBuffer: Buffer | null = null;
            try {
                console.log('[CheckStatus] Attempting to unzip...');
                const zip = new AdmZip(resultBuffer);
                const zipEntries = zip.getEntries();
                console.log(`[CheckStatus] Zip entries: ${zipEntries.length}`);

                // Find the .glb file
                const glbEntry = zipEntries.find(entry => entry.entryName.toLowerCase().endsWith('.glb'));

                if (glbEntry) {
                    console.log(`[CheckStatus] Found GLB: ${glbEntry.entryName}`);
                    glbBuffer = glbEntry.getData();
                } else {
                    console.warn('[CheckStatus] No .glb found in ZIP, checking if file itself is GLB...');
                    if (resultBuffer.subarray(0, 4).toString('ascii') === 'glTF') {
                        glbBuffer = resultBuffer;
                    }
                }
            } catch (e: any) {
                console.warn('[CheckStatus] Unzip failed, checking if direct GLB:', e);
                if (resultBuffer.subarray(0, 4).toString('ascii') === 'glTF') {
                    glbBuffer = resultBuffer;
                } else {
                    console.error('[CheckStatus] Unzip error and not a GLB:', e);
                    return NextResponse.json({ status: 'failed', error: `Unzip failed: ${e.message}` });
                }
            }

            if (!glbBuffer) {
                console.error('[CheckStatus] Could not find valid GLB file');
                return NextResponse.json({ status: 'failed', error: 'Could not find valid GLB file in Kiri result' });
            }
            console.log(`[CheckStatus] GLB extracted, size: ${glbBuffer.length}`);

            let finalBuffer = glbBuffer;
            if (BLENDER_SERVICE_URL) {
                console.log('[CheckStatus] Sending to Blender for cleanup...');

                const rawFileName = `${taskId}_raw.glb`;
                const { error: rawUploadError } = await supabaseAdmin
                    .storage
                    .from('dish-models')
                    .upload(rawFileName, glbBuffer, { contentType: 'model/gltf-binary', upsert: true });

                if (!rawUploadError) {
                    const { data: { publicUrl: rawUrl } } = supabaseAdmin.storage.from('dish-models').getPublicUrl(rawFileName);
                    console.log(`[CheckStatus] Raw model uploaded: ${rawUrl}`);

                    try {
                        const cleanupRes = await fetch(`${BLENDER_SERVICE_URL}/cleanup`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ modelUrl: rawUrl })
                        });

                        if (cleanupRes.ok) {
                            const cleanedBuffer = await cleanupRes.arrayBuffer();
                            finalBuffer = Buffer.from(cleanedBuffer);
                            console.log(`[CheckStatus] Blender cleanup successful! New size: ${finalBuffer.length}`);
                        } else {
                            console.error('[CheckStatus] Blender service failed, using raw model');
                        }
                    } catch (err) {
                        console.error('[CheckStatus] Blender service error:', err);
                    }
                } else {
                    console.error('[CheckStatus] Failed to upload raw model:', rawUploadError);
                }
            }

            // 5. Upload Final Model to Supabase
            console.log('[CheckStatus] Uploading final model to Supabase...');
            const fileName = `${taskId}.glb`;
            const { error: uploadError } = await supabaseAdmin
                .storage
                .from('dish-models')
                .upload(fileName, finalBuffer, {
                    contentType: 'model/gltf-binary',
                    upsert: true
                });

            if (uploadError) {
                console.error('[CheckStatus] Final upload failed:', uploadError);
                return NextResponse.json({ status: 'failed', error: `Final upload failed: ${uploadError.message}` });
            }

            const { data: { publicUrl } } = supabaseAdmin
                .storage
                .from('dish-models')
                .getPublicUrl(fileName);

            console.log(`[CheckStatus] Final model URL: ${publicUrl}`);

            // 6. Update DB to 'ready'
            await supabaseAdmin
                .from('generated_models')
                .update({
                    status: 'ready',
                    model_url: publicUrl
                })
                .eq('kiri_task_id', taskId);

            return NextResponse.json({ status: 'ready', modelUrl: publicUrl });

        } else if (kiriStatus === 'failed') {
            console.warn('[CheckStatus] Task failed on Kiri side');
            await supabaseAdmin
                .from('generated_models')
                .update({ status: 'failed' })
                .eq('kiri_task_id', taskId);
            return NextResponse.json({ status: 'failed', error: 'Kiri task failed' });
        } else {
            // Still processing
            return NextResponse.json({ status: 'processing' });
        }

    } catch (error: any) {
        console.error('[CheckStatus] Critical Error:', error);
        // Return 200 with failed status so frontend can handle it
        return NextResponse.json({ status: 'failed', error: error.message || 'Unknown critical error' });
    }
}
