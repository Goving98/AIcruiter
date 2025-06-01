import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        // const headersList = await headers();
        // const token = headersList.get('x-user-token');

        // if (!token) {
        //     return NextResponse.json(
        //         { error: 'Authentication required' },
        //         { status: 401 }
        //     );
        // }

        const body = await request.json();
        const { resume, job_description } = body;

        // Forward the request to FastAPI with the token
        const response = await fetch('http://localhost:8000/mock-interview/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                resume,
                job_description,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('FastAPI Error:', errorData);
            return NextResponse.json(
                { error: 'Failed to generate mock interview' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Mock interview error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}