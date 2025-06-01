'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';

type UserType = 'recruitee' | 'recruiter' | null;

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    contactNumber: string;
    location: string;
}

export default function Register() {
    const router = useRouter();
    const [userType, setUserType] = useState<UserType>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        location: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        try {

            const { confirmPassword, ...dataToSend } = formData;
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userType,
                    ...dataToSend
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // const data = await response.json();
                throw new Error(data.error || 'Registration failed');
            }

            toast.success(`Registration successful as ${userType}!`);
            router.push('/login');
        } catch (error: any) {
            toast.error(error.message);
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
                            Choose Registration Type
                        </h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => setUserType('recruitee')}
                                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                    text-white rounded-xl transform hover:scale-[1.02] transition-all duration-200 shadow-xl"
                            >
                                <span className="text-lg font-semibold">Register as Job Seeker</span>
                            </button>
                            <button
                                onClick={() => setUserType('recruiter')}
                                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                                    text-white rounded-xl transform hover:scale-[1.02] transition-all duration-200 shadow-xl"
                            >
                                <span className="text-lg font-semibold">Register as Company</span>
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
                            {userType === 'recruitee' ? 'Job Seeker Registration' : 'Company Registration'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                {userType === 'recruitee' ? 'Full Name' : 'Company Name'}
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 text-white placeholder-white/50 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 text-white placeholder-white/50 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 text-white placeholder-white/50 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Contact Number</label>
                            <input
                                type="tel"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 text-white placeholder-white/50 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 text-white placeholder-white/50 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 text-white placeholder-white/50 transition-all duration-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                                text-white rounded-lg transform hover:scale-[1.02] transition-all duration-200 shadow-xl font-semibold mt-8"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}