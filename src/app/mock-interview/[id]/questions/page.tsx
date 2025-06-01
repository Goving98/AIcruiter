'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { generateMockInterview, evaluateMockInterview } from '@/utils/api';

type QA = { question: string; ideal_answer: string };
type QuestionsResponse = { questions: Record<string, QA> };

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

type ScriptEntry =
  | { type: 'intro' | 'closing'; text: string }
  | { type: 'question'; text: string; id: string; userAnswer?: string; ideal_answer?: string };

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export default function MockQuestionsPage() {
  const router = useRouter();
  const { id: mockId } = useParams();
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<QuestionsResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isLoading, setIsLoading] = useState(true);
  const [isBrowserReady, setIsBrowserReady] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const scriptRef = useRef<ScriptEntry[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsBrowserReady(true);
  }, []);

  useEffect(() => {
    if (!isBrowserReady) return;

    // Initialize speech synthesis and recognition here
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) finalTranscript += transcript + ' ';
          }
          if (finalTranscript) setTranscript(prev => prev + finalTranscript);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isBrowserReady]);

  const enterFullscreen = () => {
    const el = document.documentElement;
    console.log('Entering fullscreen mode... by push', el);

    if (el.requestFullscreen) el.requestFullscreen();
    else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
    else if ((el as any).msRequestFullscreen) (el as any).msRequestFullscreen();
  };
  const handleStart = () => {
    enterFullscreen();
    setStarted(true);
  };


  useEffect(() => {
  const fetchQuestions = async () => {
    handleStart();
    setIsLoading(true);
    try {
      const resumeText = localStorage.getItem('resumeText');
      const jobDescription = localStorage.getItem('jobDescription');
      
      if (!resumeText || !jobDescription) {
        throw new Error('Missing required data');
      }

      toast.success('Generating mock interview questions...');
      const data = await generateMockInterview({
        resume: resumeText,
        job_description: jobDescription
      });

      setQuestions(data);
      buildScript(data);
    } catch (err) {
      toast.error('Failed to fetch mock interview questions');
      router.push('/interview/mock');
    } finally {
      setIsLoading(false);
    }
  };

  const resumeUploaded = localStorage.getItem('resumeUploaded');
  if (!resumeUploaded) {
    toast.error('Please provide your resume and job description');
    router.push('/interview/mock');
  } else {
    fetchQuestions();
  }
}, [router]);

  const buildScript = (data: QuestionsResponse) => {
    const script: ScriptEntry[] = [
      { type: 'intro', text: 'Welcome to your mock interview. I will ask you some questions based on your resume and the job description. Please speak clearly when answering.' },
      ...Object.entries(data.questions).map(([id, qa]) => ({
        type: 'question' as const,
        id,
        text: qa.question,
        ideal_answer: qa.ideal_answer
      })),
      { type: 'closing', text: 'Thank you for completing the mock interview. Your responses will now be evaluated.' }
    ];
    scriptRef.current = script;
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      // Save the answer
      const currentEntry = scriptRef.current[currentStep];
      if (currentEntry.type === 'question') {
        currentEntry.userAnswer = transcript;
      }
      setTranscript('');
    }
  };

  const handleNext = () => {
    if (currentStep < scriptRef.current.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    const answers = scriptRef.current
      .filter((entry): entry is Extract<ScriptEntry, { type: 'question' }> => entry.type === 'question')
      .reduce((acc, { id, text, userAnswer, ideal_answer }) => {
        acc[id] = {
          question: text,
          candidate_answer: userAnswer || '',
          ideal_answer: ideal_answer || ''
        };
        return acc;
      }, {} as Record<string, any>);

    try {
      const result = await evaluateMockInterview({ questions: answers });
      localStorage.setItem('mockResult', JSON.stringify(result));
      router.push(`/interview/mock/${mockId}/results`);
    } catch (error) {
      toast.error('Failed to evaluate interview');
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.rate = 0.9;
      synthRef.current.speak(utteranceRef.current);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Generating Mock Interview Questions...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentEntry = scriptRef.current[currentStep];

  if (!isBrowserReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Preparing Mock Interview...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto bg-black/50 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-white/10">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Mock Interview
            </h1>
            <p className="text-gray-400 mt-2">
              {currentEntry.type === 'question' ? 'Question' : currentEntry.type === 'intro' ? 'Introduction' : 'Conclusion'}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            <p className="text-lg text-white">
              {currentEntry.text}
            </p>
          </div>

          {currentEntry.type === 'question' && (
            <>
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 
                      ${isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {isListening ? 'Stop Recording' : 'Start Recording'}
                  </button>
                </div>

                <div className="bg-white/5 rounded-lg p-4 min-h-[100px]">
                  <p className="text-white/90">
                    {transcript || 'Your answer will appear here...'}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                hover:from-blue-600 hover:to-purple-700 text-white rounded-lg 
                transform hover:scale-[1.02] transition-all duration-200 
                shadow-xl font-semibold"
            >
              {currentStep === scriptRef.current.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}