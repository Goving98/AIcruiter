'use client';

import { generateInterview } from '@/utils/api';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

/* ---------- types ---------- */
type QA = { question: string; ideal_answer: string };

type QuestionsResponse = { questions: Record<string, QA> };

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

type ScriptEntry =
  | { type: 'intro' | 'closing'; text: string }
  | { type: 'question'; text: string; id: string; userAnswer?: string };

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

/* ---------- component ---------- */
export default function QuestionsPage() {
  const router = useRouter();
  const { id: interviewId } = useParams() as { id: string };
  const [started, setStarted] = useState(false);

  /* ----- ui / flow state ----- */
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

  /* ----- interview data ----- */
  const [questions, setQuestions] = useState<QuestionsResponse>({ questions: {} });
  const scriptRef = useRef<ScriptEntry[]>([]); // ★ master script (Q + A)
  const idx = useRef(0); // ★ pointer to current script entry
  const shouldListen = useRef(true); // ★ whether to listen for answers

  /* ----- speech recognition refs ----- */
  const transcriptRef = useRef('');
  const recognitionRef = useRef<any>(null);

  /* ===== helpers ===== */

  /** Speak a line with WebSpeech synthesis. */
  const speak = (text: string): Promise<void> =>
    new Promise((resolve, reject) => {
      console.log('Speaking:', text);
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (e) => {
        setIsSpeaking(false);
        console.error('Speech synthesis error:', e);
        reject(e);
      };

      // Cancel any ongoing synthesis before speaking
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
      }

      // Adding small delay to ensure cancel has taken effect
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 100);
    });

  /** Advance through intro → questions[] → closing. */
  const askStep = async (stepIdx: number) => {
    const step = scriptRef.current[stepIdx];
    if (!step) {
      return; // nothing left (should not happen)
    }

    setCallStatus(CallStatus.ACTIVE); // Set status to active when a step is being processed

    await speak(step.text); // Wait for the speech to finish

    if (step.type === 'question') {
      // begin listening for answer
      recognitionRef.current?.start();
      setIsListening(true);
      shouldListen.current = true; // Set to listen for answers
    } else if (step.type === 'closing') {
      toast.success('Interview completed!'); // notify user
      setCallStatus(CallStatus.FINISHED);
      await submitForEvaluation(); // ★ send answers to BE
      router.push(`/interview/${interviewId}/result`); // navigate to results
    } else if (step.type === 'intro') {
      // After intro speaks, move to the next question
      const next = idx.current + 1;
      idx.current = next;
      askStep(next);
    }
  };

  /** Called when speech recognition ends with a result. */
  const onAnswerReady = async (userAnswer: string) => {
    console.log('User answer received:', userAnswer);
    const step = scriptRef.current[idx.current];
    if (step?.type === 'question') {
      step.userAnswer = userAnswer; // ★ store answer with its question
    }

    const next = idx.current + 1;
    idx.current = next;
    askStep(next);
  };

  /** Build script once questions arrive. */
  const buildScript = (qResp: QuestionsResponse) => {
    const qScript: ScriptEntry[] = Object.entries(qResp.questions).map(
      ([id, qa]) => ({ type: 'question', id, text: qa.question })
    );
    console.log('Generated script:', qScript);

    scriptRef.current = [
      { type: 'intro', text: "Hi, let's start your interview." },
      ...qScript,
      { type: 'closing', text: 'Great job! That concludes the interview.' },
    ];
    idx.current = 0;
    askStep(idx.current); // start with the first step
  };

  /** Send collected Q&A to backend for evaluation. */
  const submitForEvaluation = async () => {
    const answersPayload = scriptRef.current
      .filter((s): s is Extract<ScriptEntry, { type: 'question' }> => s.type === 'question')
      .map(({ id, text, userAnswer }) => ({
        id,
        question: text,
        answer: userAnswer ?? '',
      }));

    try {
      console.log('Submitting evaluation for interview:', interviewId);
      console.log('Answers payload:', answersPayload);
      /*
      await evaluateInterview({
        interview_id: interviewId,
        responses: answersPayload,
      });
      */
      console.log('Evaluation submitted.');
    } catch (err) {
      console.error('Error submitting evaluation:', err);
    }
  };

  /* ===== effects ===== */

  /* Mic / recognition setup (runs once) */
  useEffect(() => {
    const initRecognition = async () => {
      if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
        alert('Browser does not support speech recognition.');
        return;
      }

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join(' ');
          transcriptRef.current = transcript;
        };

        recognition.onend = () => {
          console.log('Speech recognition ended.');
          console.log("should",shouldListen.current, scriptRef.current[idx.current]?.type)
          // ONLY restart if not manually stopped AND we are expecting an answer for a question
          if (shouldListen.current && scriptRef.current[idx.current]?.type === 'question') {
            console.log('Recognition ended unexpectedly, restarting...');
            recognitionRef.current?.start(); // Restart recognition
            setIsListening(true); // Keep listening state true
          } else {
             // If manually stopped or not a question, process the final transcript
              setIsListening(false);
              const finalText = transcriptRef.current.trim();
              if (finalText) {
                  onAnswerReady(finalText);
              }
              else{
                toast.error('No answer recorded. Please answer again.');
              }
              transcriptRef.current = ''; // Clear transcript for next input
          }
        };
        recognitionRef.current = recognition;
      } catch (err) {
        alert('Unable to access microphone.');
        console.error(err);
      }
    };

    initRecognition();
  }, []);

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
    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        // User exited fullscreen
        toast.error('You cannot exit fullscreen during the interview.');
        enterFullscreen(); // Force back to fullscreen
      }
    };

    if (started) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [started]);

  /* Fetch questions once resume is uploaded & page loads */
  useEffect(() => {
  const fetchQuestions = async () => {
    handleStart(); // Enter fullscreen mode when starting the interview
    setIsLoading(true);
    try {
      const interviewData = {
        candidate_skills: 'Python, Machine learning',
        job_description: 'Software Developer position requiring strong programming skills',
        project_details: 'Built various full-stack applications',
      };
      toast.success('Generating interview questions...');
      const data = await generateInterview(interviewData);

      setQuestions(data);
      buildScript(data); // create full script here
    } catch (err) {
      toast.error('Failed to fetch interview questions. Please try again.');
      console.error('Error fetching interview questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resumeUploaded = localStorage.getItem('resumeUploaded');
  if (!resumeUploaded) {
    toast.error('Please upload your resume before starting the interview.');
    router.push(`/interview/${interviewId}/upload`);
  } else {
    fetchQuestions();
  }
}, [interviewId, router]);

  /* ===== UI handlers ===== */

  const handleRecordAnswer = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      setIsListening(false);
      shouldListen.current = false; // Stop listening for answers
      recognitionRef.current.stop();
    } else {
      shouldListen.current = true; // Start listening for answers
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  /* ===== rendering ===== */

  if (isLoading || Object.keys(questions.questions).length === 0) {
    return (
      <div className="min-h-screen relative flex items-center justify-center text-white">
        <Image src="/images/cruiterbg.png" alt="Background" fill className="object-cover z-[-1] opacity-40" priority />
        <div className="text-2xl">Generating Questions...</div>
      </div>
    );
  }

  

  const currentScriptEntry = scriptRef.current[idx.current];
  const questionNumber = currentScriptEntry?.type === 'question' ? currentScriptEntry.id : '';
  const questionText = currentScriptEntry?.type === 'question' ? currentScriptEntry.text : '';
  

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-white">
      <Image src="/images/cruiterbg.png" alt="Background" fill className="object-cover z-[-1] opacity-40" priority />

      <div className="bg-primary-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-8">Interview Questions</h1>

        {currentScriptEntry?.type === 'question' && (
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm">
                Question {questionNumber}
              </span>
            </div>

            <p className="text-lg font-medium text-white">{questionText}</p>

            <div className="pt-4 flex gap-4 items-center justify-center">
              <button
                onClick={handleRecordAnswer}
                className={`flex items-center gap-2 ${isListening? 'bg-red-500 hover:bg-red-800 text-black' : 'bg-green-600 hover:bg-green-800 text-sky-100'}  px-4 py-2 rounded-2xl`}
                disabled={isSpeaking} // Disable button while system is speaking
              >
                {isListening ? 'Stop Listening' : '🎤 Record Answer'}
              </button>
            </div>
          </div>
        )}

        {currentScriptEntry?.type === 'intro' && (
          <p className="mt-4 text-center text-lg text-white">
            {currentScriptEntry.text}
          </p>
        )}

        {callStatus === CallStatus.FINISHED && (
          <p className="mt-4 text-center text-lg text-green-400">Interview finished – answers submitted for evaluation.</p>
        )}
      </div>
    </div>
  );
}