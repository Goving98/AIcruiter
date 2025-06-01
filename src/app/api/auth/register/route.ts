import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userType, email, password, ...userData } = body;

        // Connect to database
        const { db } = await connectToDatabase();
        const collection = userType === 'recruitee' ? 'student_details' : 'company_details';

        // Check if email already exists
        const existingUser = await db.collection(collection).findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const userDataToStore = {
            ...userData,
            email,
            password: hashedPassword,
            userType,
            createdAt: new Date(),
        };


        // Insert new user
        await db.collection(collection).insertOne(userDataToStore);

        return NextResponse.json({ 
            message: 'Registration successful',
            userType 
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}