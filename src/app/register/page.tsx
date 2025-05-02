    'use client';
    import { useState } from 'react';
    import { useRouter } from 'next/navigation';
    import toast from 'react-hot-toast';
    import Image from 'next/image';

    type UserType = 'recruitee' | 'recruiter' | null;

    interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    contactNumber: string;
    skills: string;
    companyName?: string;
    }

    export default function Register() {
    const router = useRouter();
    const [userType, setUserType] = useState<UserType>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        skills: '',
        companyName: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match!');
        return;
        }

        // Store user data in localStorage
        localStorage.setItem('registeredAs', userType as string);
        localStorage.setItem('userEmail', formData.email);
        
        // Only store skills for job seekers
        if (userType === 'recruitee') {
        localStorage.setItem('userSkills', formData.skills);
        }

        toast.success(`Registration successful as ${userType}!`);
        setIsRegistered(true);
        router.push('/login');
    };

    if (!userType) {
        return (
        <div className="min-h-screen relative flex flex-col items-center justify-center text-white">
            <Image
            src="/images/cruiterbg.png"
            alt="Background"
            fill
            className="object-cover z-[-1] opacity-40"
            priority
            />
            <div className="bg-primary-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Choose Registration Type</h2>
            <div className="space-y-4">
                <button
                onClick={() => setUserType('recruitee')}
                className="w-full bg-accent-500 text-white py-4 rounded-lg hover:bg-accent-600 
                    transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
                >
                <span className="text-lg font-medium">Register as Job Seeker</span>
                </button>
                <button
                onClick={() => setUserType('recruiter')}
                className="w-full bg-secondary-500 text-white py-4 rounded-lg hover:bg-secondary-400 
                    transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
                >
                <span className="text-lg font-medium">Register as Company</span>
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
            className="object-cover z-[-1] opacity-40"
            priority
        />
        <div className="bg-primary-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center mb-6">
            <button
                onClick={() => setUserType(null)}
                className="text-white hover:text-accent-400 transition-colors"
            >
                ← Back
            </button>
            <h2 className="text-2xl font-bold text-white flex-1 text-center">
                {userType === 'recruitee' ? 'Job Seeker Registration' : 'Company Registration'}
            </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-white mb-2">Email</label>
                <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-white/30 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-accent-500 
                    bg-white/10 text-white placeholder-white/70"
                required
                />
            </div>

            {userType === 'recruiter' && (
                <div>
                <label className="block text-white mb-2">Company Name</label>
                <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-white/30 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-accent-500 
                    bg-white/10 text-white placeholder-white/70"
                    required
                />
                </div>
            )}

            {userType === 'recruitee' && (
                <div>
                <label className="block text-white mb-2">Skills</label>
                <textarea
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-4 py-2 border border-white/30 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-accent-500 
                    bg-white/10 text-white placeholder-white/70"
                    placeholder="Enter your skills (e.g., Python, React, Machine Learning)"
                    rows={4}
                    required
                />
                <p className="text-white/60 text-sm mt-1">
                    Separate skills with commas
                </p>
                </div>
            )}

            <div>
                <label className="block text-white mb-2">Contact Number</label>
                <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full px-4 py-2 border border-white/30 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-accent-500 
                    bg-white/10 text-white placeholder-white/70"
                required
                />
            </div>

            <div>
                <label className="block text-white mb-2">Password</label>
                <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-white/30 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-accent-500 
                    bg-white/10 text-white placeholder-white/70"
                required
                />
            </div>

            <div>
                <label className="block text-white mb-2">Confirm Password</label>
                <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-white/30 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-accent-500 
                    bg-white/10 text-white placeholder-white/70"
                required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-accent-500 text-white py-3 rounded-lg hover:bg-accent-600 
                transition-all transform hover:scale-[1.02] shadow-lg mt-6"
            >
                Register
            </button>
            </form>
        </div>
        </div>
    );
    }