import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { interviewId } = await req.json();
    if (!interviewId) {
      return NextResponse.json([], { status: 200 });
    }
    const { db } = await connectToDatabase();
    const results = await db
      .collection('results')
      .find({ interview_id: interviewId })
      .toArray();
    
    console.log('Results:', results);

    for (const result of results) {
        console.log('Processing result:', result.student_id);
      if (result.student_id) {
        // Always convert student_id to ObjectId for matching _id
        let candidate = await db.collection('student_details').findOne({
          _id: new ObjectId(result.student_id),
        });
        result.candidate_name = candidate?.name || '';
      } else {
        result.candidate_name = '';
      }
      console.log('Result:', result.candidate_name);
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}