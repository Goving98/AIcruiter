import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { verifyToken } from '@/utils/jwt';

export async function POST(req: NextRequest) {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];

  // 2. Verify and decode the token
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // 3. Get the email from the payload
  const email = payload.email;
  // 4. Fetch interviews from MongoDB where company email matches
  const { db } = await connectToDatabase();
  const interviews = await db.collection('interviews').find({ companyEmail: email }).toArray();

  // 5. Return the interviews
  return NextResponse.json(interviews);
}