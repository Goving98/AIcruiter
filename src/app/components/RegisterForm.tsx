'use client'

import { useState } from 'react'

type Props = {
  role: 'recruitee' | 'recruiter'
}

export default function RegisterForm({ role }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    portfolio: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, role }
    console.log(payload)
    // send to backend
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      {role === 'recruiter' && (
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
      )}
      {role === 'recruitee' && (
        <input
          type="text"
          name="portfolio"
          placeholder="Portfolio URL"
          value={form.portfolio}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  )
}

// export RegisterForm
export type { Props as RegisterFormProps }