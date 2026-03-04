import numpy as np
import random

# -----------------------------
# CORE MATCHING FUNCTIONS
# -----------------------------
def cosine_similarity(vec1, vec2):
    v1 = np.array(list(vec1.values()))
    v2 = np.array(list(vec2.values()))
    dot = np.dot(v1, v2)
    norm = np.linalg.norm(v1) * np.linalg.norm(v2)
    if norm == 0:
        return 0.0
    return float(dot / norm)

def stability_alignment(s1, s2):
    return float(1 - abs(s1 - s2))

def sentiment_alignment(s1, s2):
    return float(1 - abs(s1 - s2))

def risk_alignment(r1, r2):
    if r1 > 0.75 or r2 > 0.75:  # safety override
        return 0.0
    if r1 < 0.4 and r2 < 0.4:
        return 1.0
    return float(1 - abs(r1 - r2))

def compute_match(userA, userB):
    """Compute match score between two trajectories"""
    emotion_sim = cosine_similarity(userA["emotion_vector"], userB["emotion_vector"])
    stability_sim = stability_alignment(userA["stability_score"], userB["stability_score"])
    sentiment_sim = sentiment_alignment(userA["weighted_sentiment"], userB["weighted_sentiment"])
    risk_sim = risk_alignment(userA["risk_momentum"], userB["risk_momentum"])

    match_score = 0.5 * emotion_sim + 0.2 * stability_sim + 0.2 * sentiment_sim + 0.1 * risk_sim
    return {
        "match_score": float(match_score),
        "breakdown": {
            "emotion_similarity": emotion_sim,
            "stability_alignment": stability_sim,
            "sentiment_alignment": sentiment_sim,
            "risk_alignment": risk_sim
        }
    }

# -----------------------------
# TOP N MATCHES
# -----------------------------
def top_n_matches(user_pool, n=3):
    results = {}
    for user in user_pool:
        scores = []
        for other in user_pool:
            if other["name"] == user["name"]:
                continue
            match = compute_match(user["trajectory"], other["trajectory"])
            scores.append({
                "name": other["name"],
                "match_score": match["match_score"],
                "qualities": {
                    "stability": other["trajectory"]["stability_score"],
                    "risk": other["trajectory"]["risk_momentum"],
                    "weighted_sentiment": other["trajectory"]["weighted_sentiment"]
                },
                "breakdown": match["breakdown"]
            })
        # Sort descending
        scores.sort(key=lambda x: x["match_score"], reverse=True)
        results[user["name"]] = scores[:n]
    return results

# -----------------------------
# SIMULATE DUMMY USERS
# -----------------------------
def simulate_users(num_users=7):
    users = []
    for i in range(1, num_users+1):
        user = {
            "name": f"User_{i}",
            "trajectory": {
                "weighted_sentiment": round(random.uniform(-1, 1), 2),
                "emotion_vector": {
                    "fear": random.random(),
                    "sadness": random.random(),
                    "neutral": random.random(),
                    "disgust": random.random(),
                    "surprise": random.random(),
                    "anger": random.random(),
                    "joy": random.random()
                },
                "stability_score": round(random.uniform(0, 1), 2),
                "risk_momentum": round(random.uniform(-0.3, 0.8), 2)
            }
        }
        # Normalize emotion vector
        total = sum(user["trajectory"]["emotion_vector"].values())
        if total > 0:
            user["trajectory"]["emotion_vector"] = {k: v / total for k, v in user["trajectory"]["emotion_vector"].items()}
        users.append(user)
    return users