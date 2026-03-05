from transformers import pipeline
from datetime import datetime
import numpy as np

# =========================
# MODEL LOADING (UNCHANGED)
# =========================

sentiment_pipeline = pipeline("sentiment-analysis")

emotion_pipeline = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None
)

theme_pipeline = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)

CANDIDATE_THEMES = [
    "academic stress",
    "relationship issues",
    "career pressure",
    "family conflict",
    "identity confusion",
    "general stress",
    "social isolation",
    "self confidence issues"
]

GROWTH_WORDS = [
    "hope", "improve", "grateful",
    "progress", "learning", "better",
    "confident", "healing"
]


# =========================
# UTILITIES
# =========================

def truncate_text(text, max_words=350):
    return " ".join(text.split()[:max_words])


def soften_distribution(vector, temperature=1.6):
    labels = list(vector.keys())
    values = np.array(list(vector.values()))
    scaled = values ** (1 / temperature)
    scaled = scaled / scaled.sum()
    return dict(zip(labels, scaled))


def calculate_entropy(vector):
    return -sum(v * np.log(v + 1e-9) for v in vector.values())


# =========================
# EMOTION BLOCK
# =========================

def analyze_emotion(text):
    results = emotion_pipeline(text)[0]
    emotion_vector = {item["label"]: item["score"] for item in results}

    # Smooth overconfident outputs
    emotion_vector = soften_distribution(emotion_vector)

    dominant = max(emotion_vector, key=emotion_vector.get)
    intensity = emotion_vector[dominant]

    entropy = calculate_entropy(emotion_vector)
    stability_index = 1 - entropy

    return {
        "vector": emotion_vector,
        "dominant": dominant,
        "intensity": float(intensity),
        "entropy": float(entropy),
        "stability_index": float(stability_index)
    }


# =========================
# SENTIMENT BLOCK (CALIBRATED)
# =========================

def analyze_sentiment(text):
    result = sentiment_pipeline(text)[0]

    label = result["label"]
    score = result["score"]

    sentiment_score = score if label == "POSITIVE" else -score

    # Dampening extreme confidence
    sentiment_score = sentiment_score * 0.7

    if sentiment_score > 0.25:
        sentiment_label = "positive"
    elif sentiment_score < -0.25:
        sentiment_label = "negative"
    else:
        sentiment_label = "neutral"

    return {
        "score": float(sentiment_score),
        "label": sentiment_label
    }


# =========================
# THEME BLOCK (MULTI-LABEL)
# =========================

def analyze_theme(text):
    text = " ".join(text.replace("\r","").replace("\n"," ").split())  # clean text
    result = theme_pipeline(
        text,
        CANDIDATE_THEMES,
        multi_label=True
    )

    themes = [
        (label, score)
        for label, score in zip(result["labels"], result["scores"])
        if score > 0.35
    ]
    if not themes:
        themes = [(result["labels"][0], result["scores"][0])]  # ensure at least 1

    primary = themes[0][0] if themes else None
    primary_conf = themes[0][1] if themes else None

    secondary = themes[1][0] if len(themes) > 1 else None
    secondary_conf = themes[1][1] if len(themes) > 1 else None

    return {
        "primary": primary,
        "primary_confidence": float(primary_conf) if primary_conf else None,
        "secondary": secondary,
        "secondary_confidence": float(secondary_conf) if secondary_conf else None,
        "all_detected": [
            {"theme": t[0], "confidence": float(t[1])}
            for t in themes
        ]
    }


# =========================
# GROWTH SIGNAL
# =========================

def detect_growth_signal(text):
    lower = text.lower()
    score = sum(lower.count(word) for word in GROWTH_WORDS) / 10
    return min(score, 1.0)


# =========================
# INTELLIGENT RISK MODEL
# =========================

def compute_risk(emotion, sentiment, theme_block, growth_score):
    fear = emotion["vector"].get("fear", 0)
    sadness = emotion["vector"].get("sadness", 0)
    entropy = emotion["entropy"]
    negative = abs(min(sentiment["score"], 0))

    theme_weight = 0
    for t in theme_block["all_detected"]:
        if t["theme"] == "social isolation":
            theme_weight += 0.1 * t["confidence"]
        if t["theme"] == "identity confusion":
            theme_weight += 0.05 * t["confidence"]

    risk = (
        0.35 * fear +
        0.35 * sadness +
        0.2 * negative +
        0.05 * entropy +
        theme_weight
    )

    # Reduce risk slightly if growth detected
    risk = risk - (0.1 * growth_score)

    risk = min(max(risk, 0), 1)

    if risk > 0.75:
        level = "high"
    elif risk > 0.45:
        level = "moderate"
    else:
        level = "low"

    return {
        "score": float(risk),
        "level": level
    }


# =========================
# METADATA
# =========================

def build_metadata(text):
    return {
        "word_count": len(text.split()),
        "timestamp": datetime.utcnow().isoformat()
    }


# =========================
# MASTER FUNCTION
# =========================

def analyze_journal(text):
    text = truncate_text(text)

    emotion_block = analyze_emotion(text)
    sentiment_block = analyze_sentiment(text)
    theme_block = analyze_theme(text)
    growth_score = detect_growth_signal(text)

    risk_block = compute_risk(
        emotion_block,
        sentiment_block,
        theme_block,
        growth_score
    )

    metadata_block = build_metadata(text)

    return {
        "emotion": emotion_block,
        "sentiment": sentiment_block,
        "theme": theme_block,
        "growth_signal": float(growth_score),
        "risk": risk_block,
        "metadata": metadata_block,
        "model_version": "v2.0"
    }