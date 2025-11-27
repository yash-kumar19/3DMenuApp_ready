import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const taskId = searchParams.get('taskId');
        if (!taskId) {
            return NextResponse.json(
                { error: 'taskId required' },
                { status: 400 }
            );
        }
        const response = await fetch(
            `https://api.kiri.engine/tasks/${taskId}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.KIRI_API_KEY}`,
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Kiri error: ${response.statusText}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Poll error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}