'use client';
import { useParams, useRouter } from 'next/navigation';

// Mock data in the new format
const mockAttemptDetails = {
  1: {
    id: 1,
    date: '2025-05-30',
    candidateName: 'John Doe',
    company: 'Some Name 1',
    role: 'Software Developer',
    overallScore: 85,
    summary: 'Great performance. Strong technical skills and communication.',
    sections: [
      {
        title: 'Technical',
        score: 90,
        questions: [
          {
            question: 'What is a closure in JavaScript?',
            answer: 'A closure is a function that has access to its own scope, the outer function’s scope, and the global scope.',
            feedback: 'Good explanation, clear and concise.',
            marks: 10,
          },
          {
            question: 'Explain the concept of REST APIs.',
            answer: 'REST APIs are web services that follow the REST architectural style, using HTTP methods for CRUD operations.',
            feedback: 'Covered the basics, could mention statelessness.',
            marks: 8,
          },
        ],
      },
      {
        title: 'Communication',
        score: 80,
        questions: [
          {
            question: 'Describe a time you worked in a team.',
            answer: 'I collaborated with my peers on a group project and ensured clear communication.',
            feedback: 'Clear explanations, good teamwork.',
            marks: 8,
          },
        ],
      },
    ],
  },
  2: {
    id: 2,
    date: '2025-05-31',
    candidateName: 'Jane Smith',
    company: 'Some Name 2',
    role: 'Frontend Developer',
    overallScore: 78,
    summary: 'Basic understanding. Needs to elaborate more in answers.',
    sections: [
      {
        title: 'Technical',
        score: 75,
        questions: [
          {
            question: 'What is a closure in JavaScript?',
            answer: 'It is a function inside another function.',
            feedback: 'Needs more detail.',
            marks: 6,
          },
        ],
      },
      {
        title: 'Communication',
        score: 80,
        questions: [
          {
            question: 'Describe a time you worked in a team.',
            answer: 'Worked on a project with classmates.',
            feedback: 'Could elaborate more.',
            marks: 7,
          },
        ],
      },
    ],
  },
};

export default function AttemptDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // attemptId may come as a string, convert to number for lookup
  const attemptId = Array.isArray(params.attemptId)
    ? params.attemptId[0]
    : params.attemptId;

  const details = mockAttemptDetails[attemptId as unknown as keyof typeof mockAttemptDetails];

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-200">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full text-center">
          <h2 className="text-xl font-bold text-red-600">Attempt not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-6 px-5 py-2 rounded bg-accent-500 hover:bg-accent-400 transition-all text-black"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-200 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700 text-center">Attempt Details</h1>
        <div className="mb-4 text-center">
          <div className="text-lg font-semibold text-black">{details.candidateName}</div>
          <div className="text-gray-600">{details.date}</div>
          <div className="text-black">{details.company} &mdash; {details.role}</div>
          <div className="mt-2 text-2xl font-bold text-green-700">{details.overallScore} <span className="text-lg text-gray-700">/ 100</span></div>
          <div className="mt-2 text-black">{details.summary}</div>
        </div>
        <div className="space-y-8">
          {details.sections.map((section, sIdx) => (
            <div key={sIdx} className="bg-indigo-50 rounded p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-accent-500 px-3 py-1 rounded-full text-sm text-black font-semibold">
                  {section.title}
                </span>
                <span className="ml-auto font-semibold text-black">
                  {section.score} / 100
                </span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded mb-3">
                <div
                  className="h-full bg-[#1d3aca] rounded"
                  style={{ width: `${section.score}%` }}
                />
              </div>
              <div className="space-y-4">
                {section.questions.map((q, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="font-semibold text-indigo-800 mb-1">Q{idx + 1}: {q.question}</div>
                    <div className="mb-1"><span className="font-medium text-gray-700">Answer:</span> <span className="text-black">{q.answer}</span></div>
                    <div className="mb-1"><span className="font-medium text-gray-700">Feedback:</span> <span className="text-black">{q.feedback}</span></div>
                    <div className="text-sm text-gray-700">Marks: <span className="font-bold">{q.marks}</span></div>
                  </div>
                ))}
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
    </div>
  );
}