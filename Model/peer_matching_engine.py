import numpy as np
import random

def cosine_similarity(vec1, vec2):
    if not vec1 or not vec2:
        return 0.0
    
    # Get all unique emotion keys
    all_keys = set(vec1.keys()).union(set(vec2.keys()))
    if not all_keys:
        return 0.0
        
    # Build aligned arrays
    v1 = np.array([vec1.get(k, 0.0) for k in all_keys])
    v2 = np.array([vec2.get(k, 0.0) for k in all_keys])
    
    dot = np.dot(v1, v2)
    norm = np.linalg.norm(v1) * np.linalg.norm(v2)
    
    if norm == 0:
        return 0.0
    return float(dot / norm)

def stability_alignment(s1, s2):
    return float(1 - abs(s1 - s2))

def sentiment_alignment(domA, domB):
    """
    Alignment based on dominant emotions.
    High score if emotions match or are highly compatible.
    """
    if domA == domB:
        return 1.0
    
    # Define compatibility groups
    positive_emotions = {"joy", "surprise", "neutral"}
    negative_emotions = {"sadness", "fear", "anger", "disgust"}
    
    if domA in positive_emotions and domB in positive_emotions:
        return 0.8
    if domA in negative_emotions and domB in negative_emotions:
        return 0.7  # Peers can relate to each other's struggles
        
    return 0.3

def risk_alignment(r1, r2):
    """
    Safety override: if either user has a risk score > 0.75, 
    they should not be matched for peer support.
    """
    if r1 > 0.75 or r2 > 0.75:
        return 0.0
    return float(1 - abs(r1 - r2))

def compute_match(userA, userB):
    """
    Compute match score between two user trajectories based on Saathi.Ai requirements:
    1. Cosine similarity (emotional similarity)
    2. Stability alignment (stability score basis)
    3. Sentiment alignment (dominant emotion basis)
    4. Risk alignment (risk threshold 0.75)
    """
    
    # Extract trajectory data
    trajA = userA.get("trajectory", userA)
    trajB = userB.get("trajectory", userB)

    # 1. Emotional Similarity (Cosine Similarity)
    emotion_sim = cosine_similarity(trajA.get("emotion_vector", {}), trajB.get("emotion_vector", {}))
    
    # 2. Stability Alignment (Stability Score basis)
    stability_sim = stability_alignment(trajA.get("stability_score", 0), trajB.get("stability_score", 0))
    
    # 3. Sentiment Alignment (Dominant Emotion basis)
    sentiment_sim = sentiment_alignment(trajA.get("dominant_emotion", "neutral"), trajB.get("dominant_emotion", "neutral"))
    
    # 4. Risk Alignment (Risk Score basis, threshold 0.75)
    risk_scoreA = trajA.get("risk_momentum", 0)
    risk_scoreB = trajB.get("risk_momentum", 0)
    risk_sim = risk_alignment(risk_scoreA, risk_scoreB)

    # Final Match Score Calculation (Weighted)
    # Weights: Emotion(40%), Sentiment(30%), Stability(20%), Risk(10%)
    match_score = 0.4 * emotion_sim + 0.3 * sentiment_sim + 0.2 * stability_sim + 0.1 * risk_sim
    
    # Safety Override: If either is high risk, no match
    if risk_scoreA > 0.75 or risk_scoreB > 0.75:
        match_score = 0.0

    return {
        "match_score": round(float(match_score), 4),
        "breakdown": {
            "emotion_similarity": round(emotion_sim, 4),
            "stability_alignment": round(stability_sim, 4),
            "sentiment_alignment": round(sentiment_sim, 4),
            "risk_alignment": round(risk_sim, 4)
        }
    }

def top_n_matches(user_pool, current_user, n=3):
    """Find top N compatible peers for a user"""
    scores = []
    for other in user_pool:
        if other.get("id") == current_user.get("id") or other.get("name") == current_user.get("name"):
            continue
        match = compute_match(current_user, other)
        scores.append({
            "user": other,
            "match_score": match["match_score"],
            "breakdown": match["breakdown"]
        })
    
    # Sort by match score descending
    scores.sort(key=lambda x: x["match_score"], reverse=True)
    return scores[:n]

def simulate_users(num_users=7):
    """Generate dummy users for testing the matching system"""
    emotions = ["joy", "sadness", "fear", "anger", "surprise", "disgust", "neutral"]
    users = []
    
    for i in range(num_users):
        # Create a random emotion vector
        vec = {e: random.random() for e in emotions}
        total = sum(vec.values())
        vec = {k: v/total for k, v in vec.items()}
        
        users.append({
            "id": f"user_{i}",
            "name": f"Peer {i}",
            "trajectory": {
                "emotion_vector": vec,
                "stability_score": random.uniform(0.3, 0.9),
                "dominant_emotion": random.choice(emotions),
                "risk_momentum": random.uniform(0, 0.5)
            }
        })
    return users