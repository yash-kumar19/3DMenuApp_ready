import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { modelUrl, options } = await request.json();

        if (!modelUrl) {
            return NextResponse.json(
                { error: 'modelUrl required' },
                { status: 400 }
            );
        }

        // Call Cloud Run Blender service
        try {
            const response = await fetch(
                process.env.BLENDER_CLEANUP_URL!,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ modelUrl, options }),
                }
            );

            if (!response.ok) {
                console.warn('Blender cleanup failed, using original model');
                // Fallback: return original model
                return NextResponse.json({
                    cleanedModelUrl: modelUrl,
                    stats: { vertices: 0, faces: 0 },
                });
            }

            const data = await response.json();
            return NextResponse.json(data);
        } catch (error) {
            console.error('Blender service error:', error);
            // Fallback: return original model
            return NextResponse.json({
                cleanedModelUrl: modelUrl,
                stats: { vertices: 0, faces: 0 },
            });
        }
    } catch (error: any) {
        console.error('Cleanup error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}