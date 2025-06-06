'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateInterview() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    role: '',
    technologies: '',
    date: '',
    timeStart: '',
    timeEnd: '',
    description: '',
    candidateEmails: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['title', 'role', 'technologies', 'date', 'timeStart', 'timeEnd', 'description'];
    const hasEmpty = requiredFields.some((key) => !form[key as keyof typeof form]);
    if (hasEmpty) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Get company email from localStorage
      const userDataStr = localStorage.getItem('userData');
      let companyEmail = '';
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          companyEmail = userData.email || '';
        } catch {}
      }

      const token = localStorage.getItem('token');

      const res = await fetch('/api/interview/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          companyEmail,
          candidateEmails: form.candidateEmails
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0),
        }),
      });

      if (!res.ok) throw new Error('Failed to create interview');
      toast.success('Interview created successfully!');
      router.push('/dashboard/company');
    } catch (err) {
      toast.error('Failed to create interview');
    }
  };

  return (
    <div className=" min-h-screen  px-4 py-8 flex justify-center items-start text-black animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-xl shadow-md w-full max-w-2xl p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-indigo-600">Create New Interview / Job</h1>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role *</label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Technologies *</label>
            <input
              type="text"
              name="technologies"
              placeholder="e.g. React, Node.js"
              value={form.technologies}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              name="date"
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              value={form.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time Slot *</label>
            <div className="flex gap-4 mt-1">
              <input
                type="time"
                name="timeStart"
                value={form.timeStart}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded-md p-2"
                required
              />
              <span className="self-center text-gray-500">to</span>
              <input
                type="time"
                name="timeEnd"
                value={form.timeEnd}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Candidate Emails (comma-separated)</label>
          <input
            type="text"
            name="candidateEmails"
            placeholder="e.g. user1@example.com, user2@example.com"
            value={form.candidateEmails}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {/* Preview top 5 emails */}
          {form.candidateEmails && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.candidateEmails
                .split(',')
                .map(email => email.trim())
                .filter(email => email.length > 0)
                .slice(0, 5)
                .map((email, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-700 text-sm px-2 py-1 rounded-full"
                  >
                    {email}
                  </span>
                ))}
              {form.candidateEmails.split(',').length > 5 && (
                <span className="text-sm text-gray-500">+ more</span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Create Interview / Job
        </button>
      </form>
    </div>
  );
}
