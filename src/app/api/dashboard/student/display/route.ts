import { verifyToken } from '@/utils/jwt';
import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

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

    // Fetch student details using userId from payload
    const student = await db.collection('student_details').findOne({ _id: new ObjectId(payload.userId) });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get interview IDs and fetch interview details
    const interviewIds = student.interviews || [];
    if (!Array.isArray(interviewIds) || interviewIds.length === 0) {
      return NextResponse.json([]);
    }

    // Convert string IDs to ObjectId
    const objectIds = interviewIds.map((id: string) => new ObjectId(id));
    const interviews = await db
      .collection('interview_details')
      .find({ _id: { $in: objectIds } })
      .toArray();

    // Filter out expired interviews (end time has passed)
    const now = new Date();
    const validInterviews = interviews.filter((doc) => {
      if (!doc.date || !doc.timeEnd) return true; // keep if missing info
      const end = new Date(`${doc.date}T${doc.timeEnd}`);
      return now <= end;
    });

    // Remove expired interview IDs from student's interviews array in DB
    const validIds = validInterviews.map((doc) => doc._id.toString());
    if (validIds.length !== interviewIds.length) {
      await db.collection('student_details').updateOne(
        { _id: new ObjectId(payload.userId) },
        { $set: { interviews: validIds } }
      );
    }

    // Map _id to id for frontend and include title
    const mapped = validInterviews.map((doc) => ({
      id: doc._id.toString(),
      date: doc.date,
      company: doc.company,
      role: doc.role,
      title: doc.title,
      timeSlot: `${doc.timeStart} - ${doc.timeEnd}`,
      timeStart: doc.timeStart,
      timeEnd: doc.timeEnd,
      status: doc.status || 'UPCOMING',
      createdAt: doc.createdAt,
      description: doc.description || '',
      companyId : doc.companyId || '',
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}