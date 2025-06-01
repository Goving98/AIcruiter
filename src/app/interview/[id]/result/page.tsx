'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SectionResult = {
  title: string;
  score: number;            // 0-100
  feedback: string[];
};

type InterviewResults = {
  id:number,
  candidateName: string;
  overallScore: number;      // 0-100
  summary: string;
  sections: SectionResult[];
};

export default function ResultsPage() {
  const { id: interviewId } = useParams() as { id: string };
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<InterviewResults | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setResults({
        id:1,
        candidateName: 'Rick Astley',
        overallScore: 82,
        summary:
          'Great technical proficiency and strong problem-solving skills. Improve on articulating design trade-offs and clarify edge-case handling.',
        sections: [
          {
            title: 'Technical',
            score: 85,
            feedback: [
              'Answered most JavaScript and React questions confidently.',
              'Demonstrated solid understanding of asynchronous patterns.',
              'Could expand on advanced TypeScript utility types.'
            ]
          },
          {
            title: 'System Design',
            score: 78,
            feedback: [
              'Identified major components correctly.',
              'Missed discussing database sharding implications.',
              'Gave thoughtful scalability considerations overall.'
            ]
          },
          {
            title: 'Behavioral',
            score: 80,
            feedback: [
              'Showed ownership of past projects.',
              'Used STAR format effectively.',
              'Could provide more metrics when describing impact.'
            ]
          }
        ]
      });
      setIsLoading(false);
    }, 800); // 0.8 s
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !results) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center text-sky-200">
        <Image
          src="/images/cruiterbg.png"
          alt="Background"
          fill
          className="object-cover z-[-1] opacity-40"
          priority
        />
        <div className="text-2xl">Generating Feedback...</div>
      </div>
    );
}

return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-sky-200">
      {/* ───────── Background image ───────── */}
        <Image
            src="/images/cruiterbg.png"
            alt="Background"
            fill
            className="object-cover z-[-1] opacity-40"
            priority
        />

        {/* ───────── Glassy card ───────── */}
        <div className="bg-primary-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 space-y-8 ">
            <h1 className="text-3xl font-bold text-center">
            Interview Results
            </h1>

            {/* Candidate & overall score */}
            <div className="text-center space-y-2">
            <p className="text-lg uppercase tracking-wider font-medium">
                {results.candidateName}
            </p>

            <div className="flex items-center justify-center gap-4">
                <span className="text-5xl font-extrabold">
                {results.overallScore}
                </span>
                <span className="text-xl font-semibold">/ 100</span>
            </div>

            <p className="text-white/80">{results.summary}</p>
            </div>

            {/* Section breakdown */}
            <div className="space-y-6 animate-fade-in">
            {results.sections.map((section) => (
                <div
                key={section.title}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-all space-y-4"
                >
                {/* Section header */}
                <div className="flex items-center gap-3">
                    <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm">
                    {section.title}
                    </span>
                    <span className="ml-auto font-semibold">
                    {section.score} / 100
                    </span>
                </div>

                {/* Progress “bar” */}
                <div className="w-full h-2 bg-white/20 rounded">
                    <div
                    className="h-full bg-[#1d3aca] rounded"
                    style={{ width: `${section.score}%` }}
                    />
                </div>

                {/* Bullet feedback */}
                <ul className="list-disc list-inside space-y-1 text-white/90">
                    {section.feedback.map((item, idx) => (
                    <li key={idx}>{item}</li>
                    ))}
                </ul>
                </div>
            ))}
            </div>

            {/* Back / Next actions */}
            <div className="flex justify-center gap-4 pt-2">
            <button
                onClick={() => router.push(`/interview/${interviewId}/questions`)}
                className="px-5 py-2 rounded bg-white/10 hover:bg-white/20 transition-all"
            >
                View Questions
            </button>
            <button
                onClick={() => router.push('/dashboard/student')}
                className="px-5 py-2 rounded bg-accent-500 hover:bg-accent-400 transition-all"
            >
                Finish
            </button>
            </div>
        </div>
        </div>
    );
}
