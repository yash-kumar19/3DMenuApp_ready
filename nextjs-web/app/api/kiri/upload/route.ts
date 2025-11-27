import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }
        // Prepare for Kiri API
        const kiriFormData = new FormData();
        files.forEach((file, index) => {
            kiriFormData.append(`image_${index}`, file);
        });
        // Call Kiri Engine
        const response = await fetch('https://api.kiri.engine/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.KIRI_API_KEY}`,
            },
            body: kiriFormData,
        });
        if (!response.ok) {
            throw new Error(`Kiri error: ${response.statusText}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}