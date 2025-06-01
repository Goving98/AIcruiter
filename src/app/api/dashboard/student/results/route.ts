import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { verifyToken } from '@/utils/jwt';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
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

    const { db } = await connectToDatabase();

    // Fetch all results for this student
    const results = await db
      .collection('results')
      .find({ student_id: payload.userId })
      .toArray();

    // Gather all interview_ids
    const interviewIds = results.map(r => r.interview_id).filter(Boolean).map(id => new ObjectId(id));

    // Fetch all interview details in one go
    const interviewsArr = await db
      .collection('interview_details')
      .find({ _id: { $in: interviewIds } })
      .toArray();

    // Create a map for quick lookup
    const interviewsMap = new Map(
      interviewsArr.map(doc => [doc._id.toString(), doc])
    );

    // Map results to frontend format, merging interview details
    const mapped = results.map((doc) => {
      const interview = interviewsMap.get(doc.interview_id?.toString() || '');
      return {
        id: doc._id.toString(),
        interview_id: doc.interview_id,
        date: interview?.date || '',
        company: interview?.company || '',
        role: interview?.role || '',
        score: doc.final_score,
        company_id: doc.company_id,
        student_id: doc.student_id,
        final_score: doc.final_score,
        technical_score: doc.technical_score,
        technical_feedback: doc.technical_feedback,
        language_score: doc.language_score,
        language_feedback: doc.language_feedback,
        behavioral_score: doc.behavioral_score,
        behavioral_feedback: doc.behavioral_feedback,
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}