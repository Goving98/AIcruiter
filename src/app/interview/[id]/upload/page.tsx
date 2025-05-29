'use client';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStart = () => {
    if (!file) {
      alert('Please upload your resume first');
      return;
    }
    // Store file in localStorage or state management
    localStorage.setItem('resumeUploaded', 'true');
    router.push(`/interview/${params.id}/questions`);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-white">
      <Image
        src="/images/cruiterbg.png"
        alt="Background"
        fill
        className="object-cover z-[-1] opacity-40"
        priority
      />
      
      <div className="bg-primary-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-8">Interview Setup</h1>
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={() => document.getElementById('resume')?.click()}
              className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-400 transition-colors"
            >
              Upload Resume (PDF)
            </button>
            <input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file && (
              <p className="mt-2 text-green-400">
                Uploaded: {file.name}
              </p>
            )}
          </div>
          
          <button
            onClick={handleStart}
            disabled={!file}
            className={`w-full bg-accent-500 text-white py-3 rounded-lg 
              ${!file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-600'} 
              transition-colors`}
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}