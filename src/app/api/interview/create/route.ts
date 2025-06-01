import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { verifyToken } from '@/utils/jwt';

export async function POST(req: NextRequest) {
  try {
    // Get and verify JWT from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();

    // Basic validation (add more as needed)
    const requiredFields = ['title', 'role', 'technologies', 'date', 'timeStart', 'timeEnd', 'description', 'companyEmail'];
    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const { db } = await connectToDatabase();

    // Fetch company name from company_details collection using companyEmail
    const companyDoc = await db.collection('company_details').findOne({ email: body.companyEmail });
    const companyName = companyDoc?.name || '';

    // Prepare the interview document
    const interview = {
      title: body.title,
      role: body.role,
      technologies: body.technologies,
      date: body.date,
      timeStart: body.timeStart,
      timeEnd: body.timeEnd,
      description: body.description,
      companyEmail: body.companyEmail,
      companyId: payload.userId,
      company: companyName, // <-- Add company name from DB
      candidateEmails: Array.isArray(body.candidateEmails) ? body.candidateEmails : [],
      createdAt: new Date(),
    };

    const result = await db.collection('interview_details').insertOne(interview);

    // Add the interview id to each student's interviews array
    if (interview.candidateEmails.length > 0) {
      await db.collection('student_details').updateMany(
        { email: { $in: interview.candidateEmails } },
        { $push: { interviews: result.insertedId.toString() } }
      );
    }

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}