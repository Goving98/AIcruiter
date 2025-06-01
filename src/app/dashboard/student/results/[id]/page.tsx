'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Section {
  title: string;
  score: number;
  feedback: string[];
}

interface ResultDetail {
  id: string;
  date: string;
  company: string;
  role: string;
  final_score: number;
  technical_score: number;
  technical_feedback: string;
  language_score: number;
  language_feedback: string;
  behavioral_score: number;
  behavioral_feedback: string;
}

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [result, setResult] = useState<ResultDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/dashboard/student/id`, {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error('Failed to fetch result');
        const data = await res.json();
        setResult(data);
      } catch {
        setResult(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchResult();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!result) return <div className="p-8">Result not found.</div>;

  // Build sections array for display
  const sections: Section[] = [
    {
      title: 'Technical',
      score: result.technical_score,
      feedback: result.technical_feedback ? [result.technical_feedback] : [],
    },
    {
      title: 'Language',
      score: result.language_score,
      feedback: result.language_feedback ? [result.language_feedback] : [],
    },
    {
      title: 'Behavioral',
      score: result.behavioral_score,
      feedback: result.behavioral_feedback ? [result.behavioral_feedback] : [],
    },
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-sky-200">
      <div className="bg-primary-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 space-y-8">
        <h1 className="text-3xl font-bold text-center text-black">
          Interview Results
        </h1>
        <div className="text-center space-y-2">
          <p className="text-lg uppercase tracking-wider font-medium text-black">
            {result.company} - {result.role}
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-5xl font-extrabold text-black">
              {result.final_score}
            </span>
            <span className="text-xl font-semibold text-black">/ 100</span>
          </div>
          <p className="text-black">Date: {result.date}</p>
        </div>
        <div className="space-y-6 animate-fade-in">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-all space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="bg-accent-500 px-3 py-1 rounded-full text-sm text-black font-semibold">
                  {section.title}
                </span>
                <span className="ml-auto font-semibold text-black">
                  {section.score} / 100
                </span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded">
                <div
                  className="h-full bg-[#1d3aca] rounded"
                  style={{ width: `${section.score}%` }}
                />
              </div>
              <ul className="list-disc list-inside space-y-1 text-black">
                {section.feedback.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => router.push('/dashboard/student/results')}
            className="px-5 py-2 rounded bg-accent-500 hover:bg-accent-400 transition-all text-black"
          >
            Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}