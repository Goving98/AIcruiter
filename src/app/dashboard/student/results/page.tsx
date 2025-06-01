'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ResultCard {
  id: string;
  date: string;
  company: string;
  role: string;
  score: number;
  final_score?: number;
  technical_score?: number;
  technical_feedback?: string;
  language_score?: number;
  language_feedback?: string;
  behavioral_score?: number;
  behavioral_feedback?: string;
}

export default function StudentResults() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [results, setResults] = useState<ResultCard[]>([]);
  const [selectedResult, setSelectedResult] = useState<ResultCard | null>(null);

  useEffect(() => {
    // Check if user is logged in and is a student
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    if (!isLoggedIn || userType !== 'recruitee') {
      toast.error('Please login to access this page');
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('token');
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/dashboard/student/results', {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        setResults(data);
      } catch (err) {
        toast.error('Failed to fetch results');
      }
    };

    fetchResults();
  }, [router]);

  const handleRowClick = (result: ResultCard) => {
    setSelectedResult(result);
  };

  const closeModal = () => setSelectedResult(null);

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-200">
      <h1 className="text-2xl font-bold mb-6 text-black">Your Results</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {results.map((result, index) => (
          <div
            key={result.id}
            className="group bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-indigo-100 transition cursor-pointer text-black
                hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:shadow-xl"
            onClick={() => handleRowClick(result)}
          >
            <div>
              <div className="text-lg font-semibold group-hover:text-white">{result.company}</div>
              <div className="text-sm text-gray-600 group-hover:text-white">{result.role}</div>
              <div className="text-xs text-gray-400 mt-1 group-hover:text-white">Date: {result.date}</div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-xl font-bold text-green-600 group-hover:text-white">{result.score}</span>
              <span className="ml-2 text-gray-700 font-medium group-hover:text-white">Score</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 pt-2">
        <button
          onClick={() => router.push('/dashboard/student')}
          className="px-5 py-2 rounded bg-accent-500 hover:bg-accent-400 transition-all text-black"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Modal for result details */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">Result Details</h2>
            <div className="space-y-2 text-black">
              <div><b>Company:</b> {selectedResult.company}</div>
              <div><b>Role:</b> {selectedResult.role}</div>
              <div><b>Date:</b> {selectedResult.date}</div>
              <div><b>Final Score:</b> {selectedResult.final_score ?? selectedResult.score}</div>
              <div><b>Technical Score:</b> {selectedResult.technical_score} {selectedResult.technical_feedback && `(${selectedResult.technical_feedback})`}</div>
              <div><b>Language Score:</b> {selectedResult.language_score} {selectedResult.language_feedback && `(${selectedResult.language_feedback})`}</div>
              <div><b>Behavioral Score:</b> {selectedResult.behavioral_score} {selectedResult.behavioral_feedback && `(${selectedResult.behavioral_feedback})`}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}