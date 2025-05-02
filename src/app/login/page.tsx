'use client';
import { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
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
    // Check if user just registered
    const registeredAs = localStorage.getItem('registeredAs');
    if (registeredAs) {
      setUserType(registeredAs as UserType);
      // Clear it after setting
      localStorage.removeItem('registeredAs');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.email === 'test@test.com' && credentials.password === 'test123') {
      // Store login status
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-indigo-100 rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-indigo-800 mb-8 text-center">Choose Login Type</h2>
          <div className="space-y-4">
            <button
              onClick={() => setUserType('recruitee')}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span className="text-lg font-medium">Login as Job Seeker</span>
            </button>
            <button
              onClick={() => setUserType('recruiter')}
              className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span className="text-lg font-medium">Login as Company</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-white">
    <Image
      src="/images/cruiterbg.png"
      alt="Background"
      fill
      className="object-cover z-[-1] opacity-40" // Darkened background
      priority
    />
    <div className="bg-primary-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-md w-full border border-white/10">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setUserType(null)}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {userType ? `${userType === 'recruitee' ? 'Job Seeker' : 'Company'} Login` : 'Choose Login Type'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-indigo-700 mb-2">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full px-4 py-3 rounded-md bg-primary-800/50 border border-white/20 
        focus:outline-none focus:ring-2 focus:ring-secondary-400 text-white placeholder-white/50"              required
            />
          </div>
          
          <div>
            <label className="block text-indigo-700 mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 rounded-md bg-primary-800/50 border border-white/20 
        focus:outline-none focus:ring-2 focus:ring-secondary-400 text-white placeholder-white/50"              required
            />
          </div>

          <button 
        className="w-full bg-accent-500 text-white py-3 rounded-md hover:bg-accent-600 transition-colors shadow-lg"
      >
        Login
      </button>
        </form>
      </div>
    </div>
  );
}