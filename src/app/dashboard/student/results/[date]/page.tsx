'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

// Example mock data with sections and feedback
const mockResults = [
	{
		id:1,
		date: 'Sep-6',
		candidateName: 'John Doe',
		company: 'Some Name 1',
		role: 'Software Developer',
		overallScore: 85,
		summary:
			'Great performance. Strong technical skills and communication.',
		sections: [
			{
				title: 'Technical',
				score: 90,
				feedback: [
					'Excellent coding skills',
					'Quick problem solving',
				],
			},
			{
				title: 'Communication',
				score: 80,
				feedback: ['Clear explanations', 'Good teamwork'],
			},
		],
	},
	{
		id:2,
		date: 'Sep-18',
		candidateName: 'John Doe',
		company: 'Some Name 1',
		role: 'Software Developer',
		overallScore: 90,
		summary:
			'Outstanding performance. Excellent problem-solving skills.',
		sections: [
			{
				title: 'Technical',
				score: 95,
				feedback: [
					' mastered all technical questions',
					'Demonstrated great coding skills',
				],
			},
			{
				title: 'Communication',
				score: 85,
				feedback: [
					'Articulated thoughts clearly',
					'Engaged in active listening',
				],
			},
		],
	},
	{
		id:3,
		date: 'Sep-20',
		candidateName: 'John Doe',
		company: 'Some Name 1',
		role: 'Software Developer',
		overallScore: 75,
		summary:
			'Satisfactory performance. Room for improvement in coding speed.',
		sections: [
			{
				title: 'Technical',
				score: 80,
				feedback: [
					'Good understanding of algorithms',
					'Needs to work on coding speed',
				],
			},
			{
				title: 'Communication',
				score: 70,
				feedback: [
					'Generally clear',
					'Occasional misunderstandings',
				],
			},
		],
	},
];

export default function ResultDetail() {
	const params = useParams();
	const router = useRouter();
	const { date } = params;

	const results = mockResults.find(
		(r) => r.date.replace(/\s/g, '-') === date
	);

	useEffect(() => {
		if (!results) {
			router.push('/dashboard/student/results');
		}
	}, [results, router]);

	if (!results) return null;

	const interviewId = date;

	return (
		<div className="min-h-screen relative flex flex-col items-center justify-center text-sky-200">

			{/* ───────── Glassy card ───────── */}
            <div className="bg-primary-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 space-y-8">
                <h1 className="text-3xl font-bold text-center text-black">
                    Interview Results
                </h1>

                {/* Candidate & overall score */}
                <div className="text-center space-y-2">
                    <p className="text-lg uppercase tracking-wider font-medium text-black">
                        {results.candidateName}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-5xl font-extrabold text-black">
                            {results.overallScore}
                        </span>
                        <span className="text-xl font-semibold text-black">/ 100</span>
                    </div>
                    <p className="text-black">{results.summary}</p>
                </div>

                {/* Section breakdown */}
                <div className="space-y-6 animate-fade-in">
                    {results.sections.map((section) => (
                        <div
                            key={section.title}
                            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-all space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className="bg-accent-500 px-3 py-1 rounded-full text-sm text-black font-semibold">
                                    {section.title}
                                </span>
                                <span className="ml-auto font-semibold text-black">
                                    {section.score} / 100
                                </span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded">
                                <div
                                    className="h-full bg-[#1d3aca] rounded"
                                    style={{ width: `${section.score}%` }}
                                />
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-black">
                                {section.feedback.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Back / Next actions */}
                <div className="flex justify-center gap-4 pt-2">
                    <button
                        onClick={() =>
                            router.push('/dashboard/student/results')
                        }
                        className="px-5 py-2 rounded bg-accent-500 hover:bg-accent-400 transition-all text-black"
                    >
                        Back to Results
                    </button>
                </div>
            </div>
		</div>
	);
}