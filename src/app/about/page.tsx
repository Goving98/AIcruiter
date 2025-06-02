'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const team = [
  { name: 'Arvind Agarwal' },
  { name: 'Ankur Banerjee' },
  { name: 'Govind Daliya' },
  { name: 'Raghuveer Oza' },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      {/* Hero Section */}
       <div className="relative bg-amber-900 h-[80vh] flex items-center justify-center text-center text-amber-400">
        <div className="absolute inset-0 opacity-80">
            <Image
            src="/images/blue-mountain.jpg"
            alt="About Background Pattern"
            fill
            style={{ objectFit: 'cover' }}
            />
        </div>
        <div className="relative bg-amber-200"></div>
        <div className="relative z-20 px-4">
            <Link href='/'>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold"
                >
                    AI-Cruiter
                </motion.h1>
            </Link>
          <p className="mt-4 text-lg md:text-xl text-amber-300">
            A product built with passion and purpose by budding engineers.
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <section className=" py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
        <h2 className="  text-4xl font-bold text-indigo-700 mb-6">What is AI-Cruiter?</h2>
        <p className="text-gray-700 text-lg mb-8">
            AI-Cruiter is an intelligent recruitment assistant designed to simplify and enhance the hiring process
            using automation, data-driven insights, and AI-powered evaluations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
            {/* For Companies */}
            <motion.div
                whileHover={{ scale: 1.15 }}
                className="bg-sky-50 p-6 rounded-xl shadow-sm"
            >
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">👩‍💼 For Companies</h3>
            <ul className="space-y-2 text-gray-700">
                <li>✔ Effortlessly create and manage interview slots</li>
                <li>✔ Track applications with clarity</li>
                <li>✔ Access automated candidate assessments</li>
                <li>✔ Make faster, more informed hiring decisions</li>
            </ul>
            </motion.div>

            {/* For Candidates */}
            <motion.div
                whileHover={{ scale: 1.15 }}
                className="bg-purple-50 p-6 rounded-xl shadow-sm"
            >
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">👨‍💻 For Candidates</h3>
            <ul className="space-y-2 text-gray-700">
                <li>✔ Mock interviews tailored to their resumes and roles</li>
                <li>✔ Simulated real interview environments using AI</li>
                <li>✔ Personalized, actionable feedback on their performance</li>
                <li>✔ Support to improve communication, technical skills, and confidence</li>
            </ul>
            </motion.div>
        </div>
        </div>
        </section>


       {/* College Highlight */}
      <section className="bg-indigo-50 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-sky-400 mb-4 ">
            Proudly Built at
            <a href='https://www.kmit.in' target="_blank" rel="noopener noreferrer"><motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: false, amount: 0.8 }}
            className="text-teal-600 font-medium"
          >
            Keshav Memorial Institute of Technology
          </motion.p></a>
          </h2>
          <p className="text-gray-600 text-lg">
            This project is a testament to the innovation and technical excellence fostered at KMIT, Hyderabad. We’re grateful for the support and learning environment provided by the faculty and institution.
          </p>
        </div>
      </section>


      {/* Team Section */}
      <section className=" py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-8">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="text-indigo-600 text-xl font-medium">{member.name}</div>
                <div className="text-sm text-gray-500 mt-1">CSM Student</div>
                <div className="text-xs text-gray-400">KMIT, Hyderabad</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-indigo-50 py-12 px-6 ">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Our Vision</h2>
        <p className="text-gray-600 text-lg">
          We believe in leveraging AI to reduce manual effort, improve decision-making, and offer a seamless
          recruitment experience for both companies and candidates. Our journey is just beginning, and we aim
          to evolve AI-Cruiter into a full-fledged talent intelligence platform.
        </p>
        </div>
      </section>
    </div>
  );
}
