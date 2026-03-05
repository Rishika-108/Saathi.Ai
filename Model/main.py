from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from journal_engine import analyze_journal
from trajectory_engine import build_weighted_trajectory
from peer_matching_engine import compute_match, top_n_matches, simulate_users

past_entries = []  # list of past journal analyses
user_pool = simulate_users(num_users=7)  # simulate 7 other users locally
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 

class JournalInput(BaseModel): 
    text: str
      
@app.post("/analyze") 
def analyze(input: JournalInput):
    current_analysis = analyze_journal(input.text)
    return current_analysis 

class TrajectoryInput(BaseModel):
    entries: list
    
@app.post("/trajectory") 
def trajectory(input: TrajectoryInput):
    entries = input.entries
    trajectory = build_weighted_trajectory(entries)
    return trajectory

class MatchingInput(BaseModel):
    users: list
    current_user_id: str
    top_n: int = 3
    
@app.post("/matching")
def matching(input: MatchingInput):
    users = input.users
    current_user_id = input.current_user_id
    n = input.top_n

    # find current user
    current_user = None
    others = []

    for u in users:
        if u["id"] == current_user_id:
            current_user = u
        else:
            others.append(u)

    if not current_user:
        return {"matches": []}

    scores = []

    for other in others:
        match = compute_match(current_user["trajectory"], other["trajectory"])

        scores.append({
            "user_id": other["id"],
            "match_score": match["match_score"],
            "breakdown": match["breakdown"]
        })

    scores.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "matches": scores[:n]
    }     