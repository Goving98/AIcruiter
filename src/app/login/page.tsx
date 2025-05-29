'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type UserType = 'recruitee' | 'recruiter' | null;

interface LoginCredentials {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>(null);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  useEffect(() => {
    const registeredAs = localStorage.getItem('registeredAs');
    if (registeredAs) {
      setUserType(registeredAs as UserType);
      localStorage.removeItem('registeredAs');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.email === 'test@test.com' && credentials.password === 'test123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', userType as string);

      toast.success('Login successful!');
      router.push(userType === 'recruitee' ? '/dashboard/student' : '/dashboard/company');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-6 bg-cover bg-center relative"  style={{ backgroundImage: "url('/images/cruiterbg.png')" }}>
        <div className="bg-blend-soft-light backdrop-blur-2xl rounded-xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
          <h2 className="text-3xl font-semibold text-center text-indigo-200 mb-6">Login as</h2>
          <div className="space-y-4">
            <button
              onClick={() => setUserType('recruitee')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium rounded-lg transition duration-200"
            >
              Job Seeker
            </button>
            <button
              onClick={() => setUserType('recruiter')}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-lg transition duration-200"
            >
              Company
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-10">
      <Image
        src="/images/cruiterbg.png"
        alt="Background"
        fill
        className="object-cover z-[-1] opacity-40"
        priority
      />
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl max-w-md w-full p-8 text-white animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setUserType(null)}
            className="text-sm text-white/70 hover:text-white transition duration-150"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-semibold text-sky-200 text-center w-full">
            {userType === 'recruitee' ? 'Job Seeker Login' : 'Company Login'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-white/50"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-white/50"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-md text-white text-lg font-medium transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
