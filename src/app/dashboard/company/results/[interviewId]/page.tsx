'use client';
import { useParams, useRouter } from 'next/navigation';

// Mock attempts data for demonstration
const mockAttempts = [
  {
    attemptId: 1,
    candidate: 'John Doe',
    score: 85,
    date: '2025-05-30',
  },
  {
    attemptId: 2,
    candidate: 'Jane Smith',
    score: 78,
    date: '2025-05-31',
  },
  {
    attemptId: 3,
    candidate: 'Jane Smith',
    score: 82,
    date: '2025-05-31',
  },
];

export default function InterviewAttemptsPage() {
  const { interviewId } = useParams();
  const router = useRouter();

  // Sort attempts by highest score first
  const sortedAttempts = [...mockAttempts].sort((a, b) => b.score - a.score);

  const handleAttemptClick = (attemptId: number) => {
    router.push(`/dashboard/company/results/${interviewId}/attempt/${attemptId}`);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-indigo-200">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Attempts for Interview ID: {interviewId}
      </h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {sortedAttempts.map((attempt) => (
          <div
            key={attempt.attemptId}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-indigo-100 text-black cursor-pointer hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:shadow-xl transition"
            onClick={() => handleAttemptClick(attempt.attemptId)}
          >
            <div>
              <div className="text-lg font-semibold">{attempt.candidate}</div>
              <div className="text-xs text-gray-400 mt-1">{attempt.date}</div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-xl font-bold text-green-600">{attempt.score}</span>
              <span className="ml-2 text-gray-700 font-medium">Score</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 pt-6">
        <button
          onClick={() => router.back()}
          className="px-5 py-2 rounded bg-accent-500 hover:bg-accent-400 transition-all text-black"
        >
          Back
        </button>
      </div>
    </div>
  );
}