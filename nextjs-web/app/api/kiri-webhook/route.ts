import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/service-role';
import AdmZip from 'adm-zip';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for processing

const BLENDER_SERVICE_URL = process.env.BLENDER_SERVICE_URL;

export async function POST(req: NextRequest) {
    try {
        console.log('[KiriWebhook] Received webhook call');

        const payload = await req.json();
        console.log('[KiriWebhook] Payload:', JSON.stringify(payload, null, 2));

        // Extract task info from Kiri webhook payload
        // Kiri typically sends: { taskId, status, resultUrl, ... }
        const taskId = payload.serialize || payload.taskId || payload.id;
        const status = payload.status;
        const resultUrl = payload.result || payload.resultUrl;

        if (!taskId) {
            console.error('[KiriWebhook] No task ID in payload');
            return NextResponse.json({ error: 'No task ID provided' }, { status: 400 });
        }

        console.log(`[KiriWebhook] Task: ${taskId}, Status: ${status}`);

        // Check if already processed
        const { data: existingRecord } = await supabaseAdmin
            .from('generated_models')
            .select('status')
            .eq('kiri_task_id', taskId)
            .single();

        if (existingRecord?.status === 'ready') {
            console.log('[KiriWebhook] Already processed, skipping');
            return NextResponse.json({ message: 'Already processed' });
        }

        if (status === 'done' || status === 'succeeded' || status === 'successful') {
            console.log('[KiriWebhook] Task completed successfully');

            if (!resultUrl) {
                console.error('[KiriWebhook] No result URL in completed task');
                await supabaseAdmin
                    .from('generated_models')
                    .update({ status: 'failed' })
                    .eq('kiri_task_id', taskId);
                return NextResponse.json({ error: 'No result URL' }, { status: 400 });
            }

            // Download result
            console.log('[KiriWebhook] Downloading result from:', resultUrl);
            const resultRes = await fetch(resultUrl);
            if (!resultRes.ok) {
                throw new Error(`Failed to download result: ${resultRes.status}`);
            }

            const resultBuffer = Buffer.from(await resultRes.arrayBuffer());
            console.log(`[KiriWebhook] Downloaded ${resultBuffer.length} bytes`);

            // Extract GLB from ZIP
            let glbBuffer: Buffer | null = null;
            try {
                console.log('[KiriWebhook] Attempting to extract GLB...');
                const zip = new AdmZip(resultBuffer);
                const zipEntries = zip.getEntries();
                console.log(`[KiriWebhook] Zip contains ${zipEntries.length} entries`);

                const glbEntry = zipEntries.find(entry => entry.entryName.toLowerCase().endsWith('.glb'));

                if (glbEntry) {
                    console.log(`[KiriWebhook] Found GLB: ${glbEntry.entryName}`);
                    glbBuffer = glbEntry.getData();
                } else {
                    console.warn('[KiriWebhook] No .glb in ZIP, checking if direct GLB...');
                    if (resultBuffer.subarray(0, 4).toString('ascii') === 'glTF') {
                        glbBuffer = resultBuffer;
                    }
                }
            } catch (e: any) {
                console.warn('[KiriWebhook] Unzip failed, checking if direct GLB:', e);
                if (resultBuffer.subarray(0, 4).toString('ascii') === 'glTF') {
                    glbBuffer = resultBuffer;
                } else {
                    throw new Error(`Unzip failed: ${e.message}`);
                }
            }

            if (!glbBuffer) {
                throw new Error('Could not find valid GLB file in result');
            }
            console.log(`[KiriWebhook] GLB extracted, size: ${glbBuffer.length}`);

            // Optional: Send to Blender for cleanup
            let finalBuffer = glbBuffer;
            if (BLENDER_SERVICE_URL) {
                console.log('[KiriWebhook] Sending to Blender for cleanup...');

                const rawFileName = `${taskId}_raw.glb`;
                const { error: rawUploadError } = await supabaseAdmin
                    .storage
                    .from('dish-models')
                    .upload(rawFileName, glbBuffer, { contentType: 'model/gltf-binary', upsert: true });

                if (!rawUploadError) {
                    const { data: { publicUrl: rawUrl } } = supabaseAdmin.storage.from('dish-models').getPublicUrl(rawFileName);
                    console.log(`[KiriWebhook] Raw model uploaded: ${rawUrl}`);

                    try {
                        const cleanupRes = await fetch(`${BLENDER_SERVICE_URL}/cleanup`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ modelUrl: rawUrl })
                        });

                        if (cleanupRes.ok) {
                            const cleanedBuffer = await cleanupRes.arrayBuffer();
                            finalBuffer = Buffer.from(cleanedBuffer);
                            console.log(`[KiriWebhook] Blender cleanup successful! New size: ${finalBuffer.length}`);
                        } else {
                            console.error('[KiriWebhook] Blender service failed, using raw model');
                        }
                    } catch (err) {
                        console.error('[KiriWebhook] Blender service error:', err);
                    }
                }
            }

            // Upload final model to Supabase
            console.log('[KiriWebhook] Uploading final model to Supabase...');
            const fileName = `${taskId}.glb`;
            const { error: uploadError } = await supabaseAdmin
                .storage
                .from('dish-models')
                .upload(fileName, finalBuffer, {
                    contentType: 'model/gltf-binary',
                    upsert: true
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabaseAdmin
                .storage
                .from('dish-models')
                .getPublicUrl(fileName);

            console.log(`[KiriWebhook] Final model URL: ${publicUrl}`);

            // Update database
            await supabaseAdmin
                .from('generated_models')
                .update({
                    status: 'ready',
                    model_url: publicUrl
                })
                .eq('kiri_task_id', taskId);

            console.log('[KiriWebhook] Processing complete!');
            return NextResponse.json({ success: true, modelUrl: publicUrl });

        } else if (status === 'failed' || status === 'error') {
            console.warn('[KiriWebhook] Task failed on Kiri side');
            await supabaseAdmin
                .from('generated_models')
                .update({ status: 'failed' })
                .eq('kiri_task_id', taskId);
            return NextResponse.json({ message: 'Task failed' });
        } else {
            // Still processing or unknown status
            console.log(`[KiriWebhook] Status is: ${status}, no action taken`);
            return NextResponse.json({ message: 'Status noted' });
        }

    } catch (error: any) {
        console.error('[KiriWebhook] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
