import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch('http://localhost:8000/mock_evaluate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to evaluate mock interview');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Mock evaluation error:', error);
        return NextResponse.json(
            { error: 'Failed to evaluate mock interview' },
            { status: 500 }
        );
    }
}

