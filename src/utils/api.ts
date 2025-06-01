interface InterviewData {
  candidate_skills?: string;
  job_description?: string;
  project_details?: string;
  resume: string;
  interview_type: string; // 'mock' | 'real'
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

    const result = await response.json();  // actually parse the JSON
    console.log('Response:', result);      // log the actual result
    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      return null;
  }

  return response;
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
