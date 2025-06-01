'use client';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) {
      setMessage('');
      return;
    }

    if (uploaded.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      setFile(null);
      setMessage('Invalid file type. Please upload a PDF.');
      return;
    }

    setFile(uploaded);
    setMessage(`Selected: ${uploaded.name}`);
  };

  const handleStart = async () => {
    if (!file) {
      alert('Please upload your resume first.');
      return;
    }

    if (!params?.id) {
      alert('Interview ID is missing.');
      return;
    }

    setIsProcessing(true);
    setMessage('Uploading and processing resume...');

    const formData = new FormData();
    formData.append('resume', file);
    try {
      const response = await fetch('/api/extractpdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text from PDF.');
      }

      const data = await response.json();

      toast.success('Resume uploaded successfully!');
      localStorage.setItem('resumeUploaded', 'true');
      localStorage.setItem('resumeText', data.text);

      router.push(`/interview/${params.id}/questions`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Error: ${error.message}`);
      setMessage(`Error: ${error.message}`);
      alert(`Failed to start interview: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
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
              disabled={isProcessing}
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
            {message && (
              <p className={`mt-2 ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </p>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={!file || isProcessing}
            className={`w-full bg-accent-500 text-white py-3 rounded-lg 
              ${(!file || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-600'} 
              transition-colors`}
          >
            {isProcessing ? 'Processing...' : 'Start Interview'}
          </button>
        </div>
      </div>
    </div>
  );
}
