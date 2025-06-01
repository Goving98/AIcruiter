import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { verifyToken } from '@/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    // Check for Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const email = payload.email;

    const { db } = await connectToDatabase();
    const interviews = await db.collection('interview_details').find({ companyEmail: email }).toArray();

    return NextResponse.json(interviews);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}