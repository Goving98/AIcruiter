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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                userType
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', userType as string);
        localStorage.setItem('userData', JSON.stringify(data.user));

        toast.success('Login successful!');
        router.push(userType === 'recruitee' ? '/dashboard/student' : '/dashboard/company');
    } catch (error: any) {
        toast.error(error.message || 'Login failed');
    }
};


if (!userType) {
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
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-8">
            Welcome Back
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setUserType('recruitee')}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                text-white rounded-xl transform hover:scale-[1.02] transition-all duration-200 shadow-xl"
            >
              <span className="text-lg font-semibold">Login as Job Seeker</span>
            </button>
            <button
              onClick={() => setUserType('recruiter')}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                text-white rounded-xl transform hover:scale-[1.02] transition-all duration-200 shadow-xl"
            >
              <span className="text-lg font-semibold">Login as Company</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        <div className="flex items-center mb-8">
          <button
            onClick={() => setUserType(null)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex-1 text-center">
            {userType === 'recruitee' ? 'Job Seeker Login' : 'Company Login'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 text-white placeholder-white/50 transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 text-white placeholder-white/50 transition-all duration-200"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
              text-white rounded-lg transform hover:scale-[1.02] transition-all duration-200 shadow-xl font-semibold mt-8"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
);
}
