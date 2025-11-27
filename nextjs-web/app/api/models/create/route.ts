import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, model_url, preview_image, status = 'processing' } = body;
        const { data, error } = await supabase
            .from('generated_models')
            .insert({
                name,
                model_url,
                preview_image,
                status,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();
        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('DB error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}