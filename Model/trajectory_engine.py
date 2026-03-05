import numpy as np
import math


def exponential_weights(n, decay=0.7):
    """Generate time-decay weights. Most recent entry gets highest weight."""
    weights = [math.exp(-decay * i) for i in reversed(range(n))]
    total = sum(weights)
    return [w / total for w in weights]


def weighted_sentiment(entries, weights):
    entries = [e for e in entries if e is not None and "sentiment" in e]
    if not entries:
        return 0.0 # default if no valid entries
    scores = [e["sentiment"]["score"] for e in entries]
    return float(sum(w * s for w, s in zip(weights, scores)))


def weighted_emotion(entries, weights):
    entries = [e for e in entries if e is not None and "emotion" in e and "vector" in e["emotion"]]
    if not entries:
        return {}, "neutral"  # default vector and dominant emotion
    emotions = entries[0]["emotion"]["vector"].keys()
    combined = {}
    for emotion in emotions:
        values = [e["emotion"]["vector"][emotion] for e in entries]
        combined[emotion] = float(sum(w * v for w, v in zip(weights, values)))

    dominant = max(combined, key=combined.get)
    return combined, dominant


def compute_volatility(e1, e2):
    v1 = np.array(list(e1["emotion"]["vector"].values()))
    v2 = np.array(list(e2["emotion"]["vector"].values()))
    return float(np.linalg.norm(v2 - v1))


def risk_momentum(e1, e2):
    return float(e2["risk"]["score"] - e1["risk"]["score"])


def build_weighted_trajectory(entries, decay=0.7):
    """
    entries: list of entry JSONs (ordered oldest → newest)
    Handles single-entry case safely.
    """
    # if not entries:
    #     # No entries yet
    #     return {}
    if not entries:
     return {
        "weighted_sentiment": 0.0,
        "dominant_emotion": "neutral",
        "emotion_vector": {},
        "volatility": 0.0,
        "stability_score": 1.0,
        "risk_momentum": 0.0,
        "memory_decay_lambda": decay
    }

    weights = exponential_weights(len(entries), decay)

    sentiment_score = weighted_sentiment(entries, weights)
    emotion_vector, dominant_emotion = weighted_emotion(entries, weights)

    # Safe volatility & risk
    if len(entries) == 1:
        volatility = 0.0
        stability_score = 1.0
        risk_change = 0.0
    else:
        volatility = compute_volatility(entries[-2], entries[-1])
        stability_score = float(1 - volatility)
        risk_change = risk_momentum(entries[-2], entries[-1])    

    return {
        "weighted_sentiment": sentiment_score,
        "dominant_emotion": dominant_emotion,
        "emotion_vector": emotion_vector,
        "volatility": volatility,
        "stability_score": stability_score,
        "risk_momentum": risk_change,
        "memory_decay_lambda": decay
    }
    

