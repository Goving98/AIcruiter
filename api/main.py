from fastapi import FastAPI, Request
from pydantic import BaseModel
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import together
# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Key
together.api_key = "tgp_v1_R4SVVmc_8XC1_NH-E-rJsMVsGksNgW9HcbOPQo7HpeI"
model_name = "mistralai/Mistral-7B-Instruct-v0.3"

# Request schema
class InterviewRequest(BaseModel):
    candidate_skills: str
    job_description: str
    project_details: str

# Helper: Call Together AP

def call_together(prompt: str, max_tokens: int = 3000):
    try:
        response = together.Complete.create(
            prompt=prompt,
            model=model_name,
            max_tokens=max_tokens,
            temperature=0.7,
            top_p=0.9
        )
        return response["choices"][0]["text"]
    except Exception as e:
        print("Together API Error:", e)
        return '{"error": "API call failed"}'

# Function: Technical + behavioral
def tech(job_description: str, candidate_skills: str):
    prompt = f"""
You are an expert interviewer preparing a customized interview based on a given **job description** and the **candidate's skill set**. Your goal is to generate **10 interview questions** along with **ideal answers** that match the job role.

### **Job Description:**
{job_description}

### **Candidate's Skill Set:**
{candidate_skills}

### **Instructions:**
- Generate **10 technical and behavioral questions** relevant to the job description.
- Provide **ideal answers** that showcase expertise based on the candidate's skill set.
- Ensure questions vary in difficulty and depth.
- Return the output in **valid JSON format** with this structure:

{{
  "1": {{
    "question": "Your general or project-based behavioral question here",
    "ideal_answer": "An ideal response showing ownership and self-awareness"
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

{{
  "1": {{
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

- Return the output in **valid JSON format** with this structure:

{{
  "1": {{
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

async def tech_eval(question, answer, ideal_answer):
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
    response = await together.Complete.create(
        prompt=prompt,
        model=model_name,
        max_tokens=300,
        temperature=0.7,
        top_p=0.9
    )
    # print(response[choices])
    if "choices" in response and response["choices"]:
        result = response["choices"][0]["text"]
    else:
        print("Together API Error:", response)
    raise ValueError("Invalid response structure from Together API")
    return response["choices"][0]["text"]

async def lang_eval(answer):
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
    response = await together.Complete.create(
        prompt=prompt,
        model=model_name,
        max_tokens=300,
        temperature=0.7,
        top_p=0.9
    )
    return response["choices"][0]["text"]

async def behave_eval(question, answer):
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
    response = await together.Complete.create(
        prompt=prompt,
        model=model_name,
        max_tokens=300,
        temperature=0.7,
        top_p=0.9
    )
    return response["choices"][0]["text"]

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
    print("Received data for interview generation:", data)
    tech_qna = tech(data.job_description, data.candidate_skills)
    lang_qna = lang(data.candidate_skills)
    behave_qna = behave(data.candidate_skills, data.project_details)

    return {
        "technical": tech_qna,
        "language": lang_qna,
        "behavioral": behave_qna
    }
