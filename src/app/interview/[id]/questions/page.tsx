'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { generateInterview } from '@/utils/api';

export default function QuestionsPage() {
  const router = useRouter();
  const { id: interviewId } = useParams() as { id: string };
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<any>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const userSkills = localStorage.getItem('userSkills') || '';
        const interviewData = {
          candidate_skills: userSkills,
          job_description: 'Software Developer position requiring strong programming skills',
          project_details: 'Built various full-stack applications',
        };

        const data = await generateInterview(interviewData);
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching interview questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const resumeUploaded = localStorage.getItem('resumeUploaded');
    if (!resumeUploaded) {
      router.push(`/interview/${interviewId}/upload`);
    } else {
      fetchQuestions();
    }
  }, [interviewId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center text-white">
        <Image
          src="/images/cruiterbg.png"
          alt="Background"
          fill
          className="object-cover z-[-1] opacity-40"
          priority
        />
        <div className="text-2xl">Generating Questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-white">
      <Image
        src="/images/cruiterbg.png"
        alt="Background"
        fill
        className="object-cover z-[-1] opacity-40"
        priority
      />

      <div className="bg-primary-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-8">Interview Questions</h1>

        {questions && Object.entries(questions.technical).map(([key, value]: [string, any]) => (
          <div
            key={key}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg space-y-4 hover:bg-white/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm">
                Question {key}
              </span>
            </div>
            <p className="text-lg font-medium text-white">{value.question}</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-white/70 mb-2">Ideal Answer:</p>
              <p className="text-white/90">{value.ideal_answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
