'use client'
import Image from 'next/image'
import Link from 'next/link'
export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-white">
      <Image
        src="/images/cruiterbg.png"
        alt="Background"
        fill
        className="object-cover z-[-1]"
        priority
      />
      <h1 className="text-5xl md:text-7xl font-bold mb-6">AI-cruiter</h1>
      <p className="text-xl md:text-2xl mb-10 text-center max-w-md">
        Intelligent Hiring Platform for Recruiters and Recruitees
      </p>
      <div className="flex gap-6">
        <Link href="/login">
          <button className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-indigo-100 transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-indigo-100 transition">
            Register
          </button>
        </Link>
      </div>
      {/* About Us Link Below */}
      <div className="mt-4">
        <Link href="/about">
          <p className="text-amber-200  hover:text-orange-500 transition">
            About us →
          </p>
        </Link>
      </div>
    </div>
  )
}
