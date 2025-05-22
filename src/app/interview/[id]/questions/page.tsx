'use client';

import { generateInterview } from '@/utils/api';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type QA = {
  question: string;
  ideal_answer: string;
};

type QuestionsResponse = {
  technical: Record<string, QA>;
};

export default function QuestionsPage() {
  const router = useRouter();
  const { id: interviewId } = useParams() as { id: string };

  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsResponse>({
    technical: {
      "1": {
        question: "What is the difference between `let`, `var`, and `const` in JavaScript?",
        ideal_answer:
          "`var` is function-scoped, while `let` and `const` are block-scoped. `const` is used for variables that shouldn't be reassigned. Avoid `var` in modern JavaScript.",
      },
      "2": {
        question: "Explain how closures work in JavaScript.",
        ideal_answer:
          "A closure is a function that has access to its own scope, the outer function's scope, and the global scope. It allows for data encapsulation and maintaining state between function calls.",
      },
      "3": {
        question: "What are Promises and how do they differ from callbacks?",
        ideal_answer:
          "Promises represent the eventual completion or failure of an asynchronous operation. They make code cleaner and more manageable than nested callbacks by using `.then()` and `.catch()`.",
      },
      "4": {
        question: "What is the purpose of React's useEffect hook?",
        ideal_answer:
          "`useEffect` allows you to perform side effects (like data fetching, subscriptions, or manually changing the DOM) in functional components. It runs after render and can optionally clean up.",
      },
      "5": {
        question: "Describe the difference between shallow and deep copy in JavaScript.",
        ideal_answer:
          "A shallow copy only copies the top-level properties, while a deep copy recursively copies all nested objects. Deep copy ensures complete separation of original and copied data.",
      }
    }
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const technicalQuestions = Object.entries(questions.technical) as [string, QA][];

  const handleNext = () => {
    if (currentQuestionIndex < technicalQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const userSkills = localStorage.getItem('userSkills') || '';
        const interviewData = {
          candidate_skills: userSkills,
          job_description: 'Software Developer position requiring strong programming skills',
          project_details: 'Built various full-stack applications',
        };

        const data = await generateInterview(interviewData);
        console.log('Generated Interview Data:', data);
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
      <div className="min-h-screen relative flex fle`x-col items-center justify-center text-white">
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

  const [questionId, qa] = technicalQuestions[currentQuestionIndex];

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

        {technicalQuestions.length > 0 && (
          <div
            key={questionId}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg space-y-4 hover:bg-white/20 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm">
                Question {questionId}
              </span>
            </div>

            <p className="text-lg font-medium text-white">{qa.question}</p>

            <div className="pt-4 flex gap-4">
              <button
                onClick={() => handleNext()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition-all"
              >
                🎤 Record Answer
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex >= technicalQuestions.length - 1}
                className={`px-5 py-2 rounded font-medium transition-all ${
                  currentQuestionIndex >= technicalQuestions.length - 1
                    ? 'bg-white/20 text-white/50 cursor-not-allowed'
                    : 'bg-accent-500 hover:bg-accent-400 text-white'
                }`}
              >
                {currentQuestionIndex >= technicalQuestions.length - 1 ? 'No more questions' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
