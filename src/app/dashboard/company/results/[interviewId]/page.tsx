'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Attempt {
  _id: string;
  candidate?: string;
  candidate_name?: string;
  final_score: number;
  technical_score: number;
  technical_feedback: string;
  language_score: number;
  language_feedback: string;
  behavioral_score: number;
  behavioral_feedback: string;
  date?: string;
  transcript?: Record<string, any>;
  company_id?: string;
  interview_id?: string;
  student_id?: string;
  [key: string]: any;
}

export default function InterviewAttemptsPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedInterviewId = localStorage.getItem('selectedInterviewId');
    setInterviewId(storedInterviewId);
    const fetchAttempts = async () => {
      try {
        const res = await fetch(`/api/dashboard/company/attempts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ interviewId: storedInterviewId }),
        });
        if (!res.ok) throw new Error('Failed to fetch attempts');
        const data = await res.json();
        setAttempts(
          data.sort((a: Attempt, b: Attempt) => (b.final_score ?? 0) - (a.final_score ?? 0))
        );
      } catch {
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };
    if (storedInterviewId) fetchAttempts();
  }, []);
  console.log(attempts);
  const handleAttemptClick = (attempt: Attempt) => {
    setSelectedAttempt(attempt);
  };

  const closeModal = () => setSelectedAttempt(null);

  // Helper to render all q1-q20
  const renderQuestions = (attempt: Attempt) => {
    const questions = [];
    for (let i = 1; i <= 20; i++) {
      const key = `q${i}`;
      if (attempt[key]) {
        questions.push(
          <div key={key} className="mb-2">
            <div className="font-semibold text-black">{key.toUpperCase()}:</div>
            <pre className="bg-gray-100 rounded p-2 text-black whitespace-pre-wrap text-sm">
              {JSON.stringify(attempt[key], null, 2)}
            </pre>
          </div>
        );
      }
    }
    return questions;
  };

  // Helper to render transcript (question and candidate_answer only)
  const renderTranscript = (transcript: Record<string, any>) => (
    <div>
      <b>Transcript:</b>
      <div className="bg-gray-100 rounded p-2 text-black text-xs space-y-2 mt-2">
        {Object.entries(transcript).map(
          ([key, value]: [string, any]) =>
            value && (
              <div key={key} className="mb-2">
                <div className="font-semibold">{key.toUpperCase()}:</div>
                <div>
                  <span className="font-medium">Q:</span> {value.question}
                </div>
                <div>
                  <span className="font-medium">Candidate Answer:</span> {value.candidate_answer}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-indigo-200">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Attempts
      </h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : attempts.length === 0 ? (
          <div>No attempts found.</div>
        ) : (
          attempts.map((attempt) => (
            <div
              key={attempt._id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-indigo-100 text-black cursor-pointer hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:shadow-xl transition"
              onClick={() => handleAttemptClick(attempt)}
            >
              <div>
                <div className="text-lg font-semibold">
                  {attempt.candidate_name || attempt.candidate || attempt.student_id}
                </div>
                <div className="text-xs text-gray-400 mt-1">{attempt.date}</div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="text-xl font-bold text-green-600">{attempt.final_score}</span>
                <span className="ml-2 text-gray-700 font-medium">Score</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center gap-4 pt-6">
        <button
          onClick={() => router.back()}
          className="px-5 py-2 rounded bg-accent-500 hover:bg-accent-400 transition-all text-black"
        >
          Back
        </button>
      </div>

      {/* Modal for attempt details */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">Attempt Details</h2>
            <div className="space-y-2 text-black">
              <div>
                <b>Candidate:</b> {selectedAttempt.candidate_name || selectedAttempt.candidate || selectedAttempt.student_id}
              </div>
              <div><b>Date:</b> {selectedAttempt.date}</div>
              <div><b>Final Score:</b> {selectedAttempt.final_score}</div>
              <div><b>Technical Score:</b> {selectedAttempt.technical_score}</div>
              <div><b>Technical Feedback:</b> {selectedAttempt.technical_feedback}</div>
              <div><b>Language Score:</b> {selectedAttempt.language_score}</div>
              <div><b>Language Feedback:</b> {selectedAttempt.language_feedback}</div>
              <div><b>Behavioral Score:</b> {selectedAttempt.behavioral_score}</div>
              <div><b>Behavioral Feedback:</b> {selectedAttempt.behavioral_feedback}</div>
              <div><b>Company ID:</b> {selectedAttempt.company_id}</div>
              <div><b>Interview ID:</b> {selectedAttempt.interview_id}</div>
              <div><b>Student ID:</b> {selectedAttempt.student_id}</div>
              {/* Transcript */}
              {selectedAttempt.transcript && renderTranscript(selectedAttempt.transcript)}
              {/* All questions */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}