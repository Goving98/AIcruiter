'use client';

import { Calendar, FileText, PlusCircle, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CompanyDashboard() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const stats = [
    { label: 'Interviews Scheduled', value: 12, icon: Calendar },
    { label: 'Total Applicants', value: 45, icon: Users },
    { label: 'Pending Reviews', value: 8, icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-center" >
      <div className=" min-h-screen px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-700">Welcome to AI-cruiter</h1>
          <p className="text-gray-600 mt-2">Smart hiring, simplified for recruiters</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {stats.map((stat, idx) => (
            <div key={idx} className=" border-indigo-600 border-1 rounded-xl shadow-2xl p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
              <stat.icon className="text-indigo-600 w-8 h-8" />
              <div>
                <p className="text-2xl font-semibold text-indigo-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Interview */}
        <div className="max-w-xl mx-auto">
          <div
            onClick={() => router.push('/dashboard/company/interview')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-xl p-8 flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <PlusCircle className="w-12 h-12 mb-2" />
            <h2 className="text-2xl font-semibold mb-2">+ Add Interview</h2>
            <p className="text-sm text-indigo-100">Create a new interview slot</p>
          </div>
        </div>

        {/* View Interviews */}
      <div className="max-w-fit mx-auto mt-6">
        <div
          onClick={() => router.push('/dashboard/company/interviews')}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl shadow-xl p-8 flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform"
        >
          <Calendar className="w-12 h-12 mb-2" />
          <h2 className="text-xl font-semibold mb-2">View Interviews</h2>
          <p className="text-sm text-indigo-100">Browse your scheduled interviews</p>
        </div>
      </div>

      </div>
    </div>
  );
}
