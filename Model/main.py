from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from journal_engine import analyze_journal
from trajectory_engine import build_weighted_trajectory
from peer_matching_engine import compute_match, top_n_matches, simulate_users

# -------------------------------
# GLOBAL STATE (hackathon MVP)
# -------------------------------
past_entries = []  # list of past journal analyses
user_pool = simulate_users(num_users=7)  # simulate 7 other users locally

# -------------------------------
# FASTAPI SETUP
# -------------------------------
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

# -------------------------------
# API ENDPOINT
# -------------------------------
@app.post("/analyze")
def analyze(input: JournalInput):
    global past_entries, user_pool

    # Step 1: Analyze current journal entry
    current = analyze_journal(input.text)

    # Step 2: Add to past_entries
    past_entries.append(current)
    if len(past_entries) > 5:  # keep last 5 entries for rolling trajectory
        past_entries.pop(0)

    # Step 3: Build weighted trajectory safely
    if len(past_entries) >= 2:
        trajectory = build_weighted_trajectory(past_entries)
    else:
        # First entry: use current analysis as trajectory
        trajectory = {
            "weighted_sentiment": current["sentiment"]["score"],
            "dominant_emotion": current["emotion"]["dominant"],
            "emotion_vector": current["emotion"]["vector"],
            "volatility": 0,
            "stability_score": current["emotion"]["stability_index"],
            "risk_momentum": 0,
            "memory_decay_lambda": 0.7
        }

    # Step 4: Add current user to pool for matching
    current_user = {"name": "CurrentUser", "trajectory": trajectory}
    temp_pool = user_pool + [current_user]  # do not mutate original pool

    # Step 5: Compute top-3 matches
    matches = top_n_matches(temp_pool, 3)  # positional arg, not keyword

    # Step 6: Prepare response
    response = {
        "past_entries": past_entries,
        "stage": "rolling_analysis",
        "trajectory": trajectory,
        "top_matches": matches
    }

    return response