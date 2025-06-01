from fastapi import FastAPI, Request
from pydantic import BaseModel
from pydantic import BaseModel
from typing import List
import together
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Allow requests from your frontend (adjust origin as needed)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows React frontend
    allow_credentials=True,
    allow_methods=["*"],    # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],    # Allows all headers
)
# Initialize FastAPI app
# app = FastAPI()

# API Key
together.api_key = "tgp_v1_R4SVVmc_8XC1_NH-E-rJsMVsGksNgW9HcbOPQo7HpeI"
model_name = "mistralai/Mistral-7B-Instruct-v0.3"

def extract_tech_qna(text):
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1 and end > start:
        return text[start:end]  # include first '{', exclude last '}'
    return ""

def extract_lang_qna(text):
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1 and end > start:
        return text[start+1:end]  # exclude both '{' and '}'
    return ""

def extract_behave_qna(text):
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1 and end > start:
        return text[start+1:end+1]  # exclude first '{', include last '}'
    return ""



# Request schema
class InterviewRequest(BaseModel):
    candidate_skills: str
    job_description: str
    project_details: str

class MockInterviewRequest(BaseModel):
    candidate_skills: str
    tech_q: int
    tech_l: int
    tech_b: int

# Helper: Call Together AP

def call_together(prompt: str, max_tokens: int = 3000):
    response = together.Complete.create(
        prompt=prompt,
        model=model_name,
        max_tokens=max_tokens,
        temperature=0.7,
        top_p=0.9
    )
    # print(response['choices'][0]["text"])
    return response["choices"][0]["text"]

# Function: Technical
def tech(job_description: str, candidate_skills: str):
    prompt = f"""
You are an expert interviewer preparing a customized interview based on a given **job description** and the **candidate's skill set**. Your goal is to generate **10 interview questions** along with **ideal answers** that match the job role.

### **Job Description:**
{job_description}

### **Candidate's Skill Set:**
{candidate_skills}

### **Instructions:**
- Generate **10 technical** relevant to the job description.
- Provide **ideal answers** that showcase expertise based on the candidate's skill set.
- Ensure questions vary in difficulty and depth.
- Return the output in **valid JSON format** with this structure:

{{
  "q1": {{
    "question": "Your technical question here",
    "ideal_answer": "An ideal response for the skills"
  }},
  "q2": {{
    "question": "Your technical question here",
    "ideal_answer": "An ideal response for the skills"
  }},
  ...
}}
"""
    return call_together(prompt, max_tokens=6000)

# Function: Language
def lang(candidate_skills: str):
    prompt = f"""
You are an experienced interviewer assessing a candidate's **English language proficiency**.

### **Candidate's Skill Set:**
{candidate_skills}

### **Instructions:**
- Generate **5 interview questions** specifically to test the candidate’s **English language fluency, grammar, vocabulary, articulation, comprehension, and clarity of thought**.
- Provide **ideal answers** that reflect strong communication skills based on the candidate's technical background.
- Return the output in **valid JSON format** with this structure:
- start from q11

{{
  "q11": {{
    "question": "Your language proficiency question here",
    "ideal_answer": "An ideal response with strong communication"
  }},
  "q12": {{
    "question": "Your language proficiency question here",
    "ideal_answer": "An ideal response with strong communication"
  }},
  ...
}}
"""
    return call_together(prompt)

# Function: Behavioral
def behave(candidate_skills: str, project_details: str):
    prompt = f"""
You are an expert interviewer preparing **behavioral interview questions**, including project-specific ones, based on the candidate's skills and project experience.

### **Candidate's Skill Set:**
{candidate_skills}

### **Project Experience:**
{project_details}

### **Instructions:**
- Generate **5 behavioral interview questions**:
  - 3 general behavioral questions
  - 2 questions specifically based on the provided project experience
- Questions should explore the candidate's problem-solving, ownership, teamwork, decision-making, and conflict resolution skills.
- Provide ideal answers demonstrating thoughtfulness, leadership, and technical depth.
- start from q16
- Return the output in **valid JSON format** with this structure:

{{
  "q16": {{
    "question": "Your general or project-based behavioral question here",
    "ideal_answer": "An ideal response showing ownership and self-awareness"
  }},
  "q17": {{
    "question": "Your general or project-based behavioral question here",
    "ideal_answer": "An ideal response showing ownership and self-awareness"
  }},
  ...
}}
"""
    return call_together(prompt)
  
class EvaluationRequest(BaseModel):
    tech_questions: List[str]
    tech_answers: List[str]
    tech_ideal_answers: List[str]
    language_answers: List[str]
    behavioral_questions: List[str]
    behavioral_answers: List[str]

def tech_eval(question, answer, ideal_answer):
    model_name = "mistralai/Mistral-7B-Instruct-v0.3"
    prompt = f"""
You are a technical evaluator for machine learning interviews.

Instructions:
1. Identify key technical terms or methods from the ideal answer.
2. Count how many of these appear in the candidate's answer.
3. Score from 0 to 100 based on completeness and technical correctness.
4. Give brief feedback mentioning missing or well-covered areas.

Format:
Score: <score>
Feedback: <short feedback>

Question:
"{question}"

Ideal Answer:
"{ideal_answer}"

Candidate Answer:
"{answer}"
"""
    response = together.Complete.create(
        prompt=prompt,
        model=model_name,
        max_tokens=300,
        temperature=0.7,
        top_p=0.9
    )
    return response["choices"][0]["text"]

def lang_eval(answer):
    model_name = "mistralai/Mistral-7B-Instruct-v0.3"
    prompt = f"""
You are evaluating the spoken fluency of a candidate's response in an interview.

Instructions:
1. Detect filler words (e.g., “uh”, “umm”, “aahhh”, “you know”, etc.).
2. Score between 0 and 100 based on fluency and clarity. More filler words = lower score.
3. If the speech is natural, fluent, and confident, score higher.
4. Provide 1-2 lines of feedback on how to improve fluency if needed.

Candidate Response:
"{answer}"

Format:
Score: <score>
Feedback: <short feedback>
"""
    response = together.Complete.create(
        prompt=prompt,
        model=model_name,
        max_tokens=300,
        temperature=0.7,
        top_p=0.9
    )
    return response["choices"][0]["text"]

def behave_eval(question, answer):
    model_name = "mistralai/Mistral-7B-Instruct-v0.3"
    prompt = f"""
You are a behavioral interview evaluator.

Evaluate the candidate's answer using:
- Clarity
- Relevance
- Emotional intelligence
- Depth of reflection
-Score between 0 and 100

Behavioral Question:
"{question}"

Candidate Answer:
"{answer}"

Format:
Score: <score>
Feedback: <feedback>
"""
    response = together.Complete.create(
        prompt=prompt,
        model=model_name,
        max_tokens=300,
        temperature=0.7,
        top_p=0.9
    )
    return response["choices"][0]["text"]

# Function: Mock
def mock(candidate_skills: str, tech_q: int, tech_l: int, tech_b: int):
    prompt = f"""
You are an expert interviewer preparing a customized interview based on a given the **candidate's skill set**. Your goal is to generate **interview questions** along with **ideal answers** that match the job role having {tech_q} technical questions, {tech_l} language proficiency questions, and {tech_b} behavioral questions.


### **Candidate's Skill Set :**
{candidate_skills}

### **Instructions:**
- Generate **technical, language and behavioral questions** relevant to the candidate skills.
- Provide **ideal answers** that showcase expertise based on the candidate's skill set.
- Ensure questions vary in difficulty and depth.
- Return the output in **valid JSON format** with this structure:
- Return {tech_q} technical questions, {tech_l} language proficiency questions, and {tech_b} behavioral questions a total of {tech_q + tech_l + tech_b} questions.
{{
  "q1": {{
    "question": "Your technical question here",
    "ideal_answer": "An ideal response for the skills"
  }},
  ...
}}
"""
    return call_together(prompt, max_tokens=6000)



@app.post("/evaluate")
async def evaluate(data: EvaluationRequest):
    tech_scores = []
    for q, a, ideal in zip(data.tech_questions, data.tech_answers, data.tech_ideal_answers):
        result = tech_eval(q, a, ideal)
        tech_scores.append(result)

    lang_scores = []
    for a in data.language_answers:
        result = lang_eval(a)
        lang_scores.append(result)

    behave_scores = []
    for q, a in zip(data.behavioral_questions, data.behavioral_answers):
        result = behave_eval(q, a)
        behave_scores.append(result)

    # Extract numeric scores from each response (basic string parsing)
    def extract_score(text):
        for line in text.splitlines():
            if "Score" in line:
                try:
                    return int(''.join([c for c in line if c.isdigit()]))
                except:
                    return 0
        return 0

    tech_avg = sum(extract_score(s) for s in tech_scores) / len(tech_scores) if tech_scores else 0
    lang_avg = sum(extract_score(s) for s in lang_scores) / len(lang_scores) if lang_scores else 0
    behave_avg = sum(extract_score(s) for s in behave_scores) / len(behave_scores) if behave_scores else 0
    final_avg = round(((tech_avg*10) + (lang_avg*5) + (behave_avg*5)) / 20, 2)

    return {
        "technical_scores": tech_scores,
        "language_scores": lang_scores,
        "behavioral_scores": behave_scores,
        "average_scores": {
            "technical": tech_avg,
            "language": lang_avg,
            "behavioral": behave_avg,
            "final_score": final_avg
        }
    }


# POST endpoint
@app.post("/generate-interview/")
async def generate_interview(data: InterviewRequest):
    tech_qna = tech(data.job_description, data.candidate_skills)
    lang_qna = lang(data.candidate_skills)
    behave_qna = behave(data.candidate_skills, data.project_details)

    
    tech_part = extract_tech_qna(tech_qna)
    lang_part = extract_lang_qna(lang_qna)
    behave_part = extract_behave_qna(behave_qna)
    combined_json_str = "{" + tech_part.strip("{}") + "," + lang_part.strip("{}") + "," + behave_part.strip("{}") + "}"

    # Parse the stringified JSON into a Python dict
    questions_dict = json.loads(combined_json_str)
    print(questions_dict)
    return {
        "questions": questions_dict
    }
    
@app.post("/mock-interview/")
async def mock_interview(data: MockInterviewRequest):
    
    qna = mock(data.candidate_skills,data.tech_q,data.tech_l,data.tech_b)
    qna= extract_tech_qna(qna)
    combined_json_str = "{" + qna.strip("{}") + "}"
    questions_dict = json.loads(combined_json_str)
    return {
        "questions": questions_dict
    }
