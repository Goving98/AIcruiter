import json
import os
import re
from typing import List, Optional

import together
from fastapi import Body, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# from dotenv import load_dotenv

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
together.api_key = os.getenv("TOGETHER_API_KEY", None)  # Set your Together API key here
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

def parse_score_feedback(text):
    # Find all scores and feedbacks in the text
    scores = [int(s) for s in re.findall(r"Score:\s*(\d+)", text)]
    feedbacks = re.findall(r"Feedback:\s*(.*)", text)
    # Use the last found score/feedback if multiple, else None/""
    score = scores[-1] if scores else None
    feedback = feedbacks[-1] if feedbacks else ""
    return {
        "score": score,
        "feedback": feedback
    }



# Request schema
class InterviewRequest(BaseModel):
    candidate_skills : Optional[str] = None
    job_description: Optional[str] = None
    project_details: Optional[str] = None
    interviewId: str
    resume : str

class MockInterviewRequest(BaseModel):
    resume: str
    job_description: str
    resume: Optional[str] = None

class EvaluationRequest(BaseModel):
    tech_questions: List[str]
    tech_answers: List[str]
    tech_ideal_answers: List[str]
    language_answers: List[str]
    behavioral_questions: List[str]
    behavioral_answers: List[str]


# Helper: Call Together API

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
def tech(job_description: str, resume: str):
    prompt = f"""
You are an expert interviewer preparing a customized interview based on a given **job description** and the **candidate's skill set** that you can extract from the **resume**. Your goal is to generate **10 interview questions** along with **ideal answers** that match the job role.

### **Job Description:**
{job_description}

### **Candidate's Resume:**
{resume}

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
def lang(resume: str):
    prompt = f"""
You are an experienced interviewer assessing a candidate's **English language proficiency**.

### **Candidate's Resume**
{resume}

### **Instructions:**
- Generate **5 interview questions** specifically to test the candidate’s **English language fluency, grammar, vocabulary, articulation, comprehension, and clarity of thought**.
- Provide **ideal answers** that reflect strong communication skills based on the candidate's technical background and resume.
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
def behave(resume: str):
    prompt = f"""
You are an expert interviewer preparing **behavioral interview questions**, including project-specific ones, based on the candidate's skills and project experience.

### **Candidate's Resume**
{resume}


### **Instructions:**
- Generate **5 behavioral interview questions**:
  - 3 general behavioral questions
  - 2 questions specifically based on the provided project experience extracted from the resume.
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


#Function: Feedback
def feedback(feedback_text: str):
    prompt = f"""You are a feedback evaluator for interview responses.
Your task is to analyze the feedback text and provide a overall feedback based on all the individual feedbacks for all the questions based on {feedback_text}.
- make the summary feedback in 2-3 lines 
- just sumamrize the feedbacks and do not repeat the individual feedbacks or any scores.
- do not mention any individual question or answer in the feedback i just need some text that summarizes the overall performance of the candidate.
Format:
Overall Feedback: <summary>

- Overall Feedback should be concise and actionable, focusing on key strengths and areas for improvement and only given once.
"""
    return call_together(prompt, max_tokens=6000)
# Function: Mock
def mock(resume: str,job_description: str):
    prompt = f"""
You are an expert interviewer preparing a customized interview based on a given the **candidate's skill set** and **porjects** from the **resume** provided. Your goal is to generate **interview questions** along with **ideal answers** that match the job role having 10 technical questions, 5 language proficiency questions, and 5 behavioral questions.


### **Candidate's resume :**
{resume}

### **Instructions:**
- Generate **technical, language and behavioral questions** relevant to the candidate skills.
- Provide **ideal answers** that showcase expertise based on the candidate's skill set.
- Ensure questions vary in difficulty and depth.
- Return the output in **valid JSON format** with this structure:
- Return 10 technical questions, 5 language proficiency questions, and 5 behavioral questions a total of 20 questions.
{{
  "q1": {{
    "question": "Your technical question here",
    "ideal_answer": "An ideal response for the skills"
  }},
  ...
}}
"""
    return call_together(prompt, max_tokens=10000)



@app.post("/evaluate")
async def evaluate(
    data: dict = Body(...)
):
    print("Received data:", data)
    questions = data.get("questions", {})
    print("questions", questions)
    tech_scores = []
    lang_scores = []
    behave_scores = []

    # First 10: tech, next 5: lang, last 5: behave
    sorted_qids = sorted(questions.keys(), key=lambda x: int(x[1:]))  # sort by q number
    for idx, qid in enumerate(sorted_qids):
        qdata = questions[qid]
        question = qdata.get("question", "")
        candidate_answer = qdata.get("candidate_answer", "")
        ideal_answer = qdata.get("ideal_answer", "")

        if idx < 10:
            result = tech_eval(question, candidate_answer, ideal_answer)
            tech_scores.append(parse_score_feedback(result))
        elif idx < 15:
            result = lang_eval(candidate_answer)
            lang_scores.append(parse_score_feedback(result))
        else:
            result = behave_eval(question, candidate_answer)
            behave_scores.append(parse_score_feedback(result))

    def extract_score(obj):
        return obj.get("score", 0) if isinstance(obj, dict) else 0
    def extract_overall_feedback(text: str) -> str:
        if "Overall Feedback:" in text:
            return text.split("Overall Feedback:", 1)[1].strip()
        return ""

    tech_avg = sum(extract_score(s) for s in tech_scores) / len(tech_scores) if tech_scores else 0
    lang_avg = sum(extract_score(s) for s in lang_scores) / len(lang_scores) if lang_scores else 0
    behave_avg = sum(extract_score(s) for s in behave_scores) / len(behave_scores) if behave_scores else 0
    final_avg = round(((tech_avg * 10) + (lang_avg * 5) + (behave_avg * 5)) / 20, 2)

    technical_feedback = feedback("technical feedback")
    language_feedback = feedback("language feedback")
    behavioral_feedback = feedback("behavioral feedback")

    tech_overall_feedback = extract_overall_feedback(technical_feedback).replace('\n', ' ').strip()
    lang_overall_feedback = extract_overall_feedback(language_feedback).replace('\n', ' ').strip()
    behave_overall_feedback = extract_overall_feedback(behavioral_feedback).replace('\n', ' ').strip()

    return {
        "final_score": final_avg,
        "technical_scores": tech_scores,
        "technical": tech_avg,
        "technical_feedback": tech_overall_feedback,
        "language_scores": lang_scores,
        "language": lang_avg,
        "language_feedback": lang_overall_feedback,
        "behavioral_scores": behave_scores,
        "behavioral": behave_avg,
        "behavioral_feedback": behave_overall_feedback,
    }

# POST endpoint
@app.post("/generate-interview/")
async def generate_interview(data: InterviewRequest):
    tech_qna = tech(data.job_description, data.resume)
    lang_qna = lang(data.resume)
    behave_qna = behave(data.resume)

    
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
    
    qna = mock(data.resume,data.job_description)
    qna= extract_tech_qna(qna)
    combined_json_str = "{" + qna.strip("{}") + "}"
    questions_dict = json.loads(combined_json_str)
    return {
        "questions": questions_dict
    }
