import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { verifyToken } from '@/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Get company details
    const company = await db.collection('company_details').findOne({ email: payload.email });
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Get interviews count
    const interviewsScheduled = await db.collection('interview_details').countDocuments({
      companyId: company._id.toString()
    });

    // Get total applicants
    const totalApplicants = await db.collection('interview_details').aggregate([
      { $match: { companyId: company._id.toString() } },
      { $project: { candidateCount: { $size: "$candidateEmails" } } },
      { $group: { _id: null, total: { $sum: "$candidateCount" } } }
    ]).toArray();

    // Get pending reviews count (interviews without results)
    const pendingReviews = await db.collection('interview_details').countDocuments({
      companyId: company._id.toString(),
      result: { $exists: false }
    });

    return NextResponse.json({
      interviewsScheduled,
      totalApplicants: totalApplicants[0]?.total || 0,
      pendingReviews
    });

  } catch (error) {
    console.error('Error fetching company stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}