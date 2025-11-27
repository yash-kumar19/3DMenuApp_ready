import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/service-role';

const KIRI_API_KEY = process.env.KIRI_API_KEY;
const KIRI_BASE_URL = 'https://api.kiriengine.app/api';

export async function POST(req: NextRequest) {
  // Check for Kiri API Key
  if (!KIRI_API_KEY) {
    console.error('KIRI_API_KEY is not configured!');
    return NextResponse.json({ error: 'Server Error: KIRI_API_KEY is not configured' }, { status: 500 });
  }

  // Check for Supabase Service Role Key
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not configured!');
    return NextResponse.json({
      error: 'Server Error: SUPABASE_SERVICE_ROLE_KEY is missing. Please check .env.local'
    }, { status: 500 });
  }

  try {
    // Parse JSON body instead of FormData
    const body = await req.json();
    const { imageUrls, userId } = body;

    if (!imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json({ error: 'Invalid request: imageUrls array is required' }, { status: 400 });
    }

    // Enforce Kiri's 20 image limit
    if (imageUrls.length < 20) {
      return NextResponse.json({ error: 'Please upload at least 20 images for high-quality 3D generation.' }, { status: 400 });
    }

    console.log(`Starting generation for ${imageUrls.length} images...`);

    // 1. Upload images to Kiri Engine
    const kiriFormData = new FormData();

    // Download images from URLs and append to Kiri FormData
    console.log('Downloading images from URLs...');
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      try {
        const imgRes = await fetch(url);
        if (!imgRes.ok) throw new Error(`Failed to fetch image: ${url}`);
        const buffer = Buffer.from(await imgRes.arrayBuffer());

        // Append to Kiri form data
        kiriFormData.append('imagesFiles', new Blob([buffer], { type: 'image/jpeg' }), `image_${i}.jpg`);
      } catch (err) {
        console.error(`Error processing image ${i}:`, err);
      }
    }

    // Add parameters for 3DGS mode and webhook
    kiriFormData.append('mode', '3dgs');
    kiriFormData.append('export', 'gltf');

    // Add webhook URL - Kiri will call this when processing is complete
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/kiri-webhook`
      : 'https://your-app.vercel.app/api/kiri-webhook';

    kiriFormData.append('webhook', webhookUrl);
    console.log('Webhook URL:', webhookUrl);

    console.log('Uploading to Kiri Engine...');
    const uploadRes = await fetch(`${KIRI_BASE_URL}/v1/open/photo/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIRI_API_KEY}`,
      },
      body: kiriFormData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Kiri upload failed:', errorText);
      throw new Error(`Kiri upload failed: ${errorText}`);
    }

    const uploadData = await uploadRes.json();
    console.log('Kiri Upload Response:', JSON.stringify(uploadData, null, 2));

    if (!uploadData.ok || !uploadData.data?.serialize) {
      throw new Error('Failed to get task ID (serialize) from Kiri');
    }

    const taskId = uploadData.data.serialize;
    console.log('Kiri Task Started:', taskId);

    // 2. Insert into Database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('generated_models')
      .insert({
        user_id: userId || '00000000-0000-0000-0000-000000000000',
        kiri_task_id: taskId,
        status: 'processing',
        name: `3D Scan ${new Date().toLocaleTimeString()}`,
        thumbnail_url: imageUrls[0] || '',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert failed:', dbError);
    }

    return NextResponse.json({
      success: true,
      taskId: taskId,
      dbId: dbData?.id,
      message: 'Generation started successfully. Webhook will be called when complete.'
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
