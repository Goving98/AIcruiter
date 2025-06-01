'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    name: 'Govind Daliya',
    contactNumber: '7981955272',
    location: 'hyd',
    email: 'govinddaliya99@gmail.com',
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    toast.success('Profile updated!');
    // Send updated profile to backend here if needed
  };

  const handleCancel = () => setEditing(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-200 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Student Profile</h1>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={profile.contactNumber}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            {editing ? (
              <>
                <button
                  type="submit"
                  form="profileForm"
                  onClick={handleSave}
                  className="px-5 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="px-5 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}