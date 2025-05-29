interface InterviewData {
  candidate_skills: string;
  job_description: string;
  project_details: string;
}

export const generateInterview = async (data: InterviewData) => {
  try {
    const response = await fetch('http://localhost:8000/generate-interview/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    console.log('Response:', response.json);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const evaluateInterview = async (body: {
  interviewId: string;
  responses: {
    questionId: string;
    question: string;
    ideal_answer: string;
    userAnswer?: string;
  }[];
}) => {
  try {
    const res = await fetch('/api/evaluateInterview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (err) {
    console.error('Error in evaluateInterview:', err);
    throw err;
  }
};
