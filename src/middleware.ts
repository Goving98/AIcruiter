import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils/jwt';

export function middleware(request: NextRequest) {
    // Exclude auth routes from middleware
    const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/extractpdf'];
    if (publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    const payload = verifyToken(token);
    if (!payload) {
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*']
};