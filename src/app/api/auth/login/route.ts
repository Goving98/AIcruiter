import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/utils/jwt';

export async function POST(request: Request) {
    try {
        const { email, password, userType } = await request.json();

        if (!email || !password || !userType) {
            return NextResponse.json(
                { error: 'Please provide all required fields' },
                { status: 400 }
            );
        }


        const { db } = await connectToDatabase();
        const collection = userType === 'recruitee' ? 'student_details' : 'company_details';

        // Find user
        const user = await db.collection(collection).findOne({ email });

        
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            userType: user.userType
        });

        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token ,
            userType 
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed. Please try again' },
            { status: 500 }
        );
    }
}