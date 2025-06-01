'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { generateMockInterview } from '@/utils/api';

export default function MockInterview() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      toast.error('Please provide both resume and job description');
      return;
    }

    try {

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        router.push('/login');
        return;
      }

      // Extract PDF content

      const formData = new FormData();
      formData.append('resume', file);

      toast.loading('Processing resume...');

      const extractResponse = await fetch('/api/extractpdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!extractResponse.ok) {
        throw new Error('Failed to extract resume content');
      }

      const { text: resumeText } = await extractResponse.json();

      localStorage.setItem('resumeText', resumeText);
      localStorage.setItem('jobDescription', jobDescription);
      localStorage.setItem('resumeUploaded', 'true');
      localStorage.setItem('interviewType', 'mock');


      const mockInterviewId = `mock-${Date.now()}`;

      // Make the mock interview request
      const mockResponse = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify({
          resume: resumeText,
          job_description: jobDescription,
        //   mock_id: mockInterviewId
        }),
      });

      if (!mockResponse.ok) {
        const errorData = await mockResponse.json();
        throw new Error(errorData.error || 'Failed to generate mock interview');
      }

      // Navigate after successful API call
      router.push(`/mock-interview/${mockInterviewId}/questions`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to process resume');
      console.error('Mock interview error:', error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <Image
        src="/images/cruiterbg.png"
        alt="Background"
        fill
        className="object-cover z-[-1] opacity-40"
        priority
      />
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-xl blur-xl"></div>
        <div className="relative bg-black/70 backdrop-blur-xl rounded-xl shadow-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-8">
            Mock Interview Setup
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Upload Resume (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-white 
                  placeholder-white/50"
                rows={4}
                placeholder="Enter the job description for targeted interview questions..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
                hover:from-blue-600 hover:to-purple-700 text-white rounded-lg 
                transform hover:scale-[1.02] transition-all duration-200 
                shadow-xl font-semibold"
            >
              Start Mock Interview
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}