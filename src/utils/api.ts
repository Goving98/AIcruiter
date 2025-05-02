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

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

