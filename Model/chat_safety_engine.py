# import numpy as np
# import torch
# from transformers import pipeline
# from collections import deque


# class ChatSafetyEngine:

#     def __init__(self, window_size=10):

#         # -------------------------
#         # Device Detection
#         # -------------------------
#         self.device = 0 if torch.cuda.is_available() else -1

#         # -------------------------
#         # Emotion Model
#         # -------------------------
#         self.emotion_model = pipeline(
#             "text-classification",
#             # model="SamLowe/roberta-base-go_emotions",
#             model="j-hartmann/emotion-english-distilroberta-base",
#             top_k=None,
#             device=self.device
#         )

#         # -------------------------
#         # Intent Model
#         # -------------------------
#         self.intent_model = pipeline(
#             "zero-shot-classification",
#             # model="facebook/bart-large-mnli",
#             model="MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli",
#             device=self.device
#         )

#         # -------------------------
#         # Conversation Memory
#         # -------------------------
#         self.memory = deque(maxlen=window_size)

#         # -------------------------
#         # Emotion Weights
#         # -------------------------
#         self.emotion_weights = {
#             "sadness": 2,
#             "fear": 3,
#             "anger": 2,
#             "grief": 4,
#             "disappointment": 2,
#             "nervousness": 2,
#             "remorse": 2,
#             "despair": 4,
#             "embarrassment": 1,
#             "joy": -2,
#             "gratitude": -2,
#             "optimism": -2,
#             "relief": -1
#         }

#         # -------------------------
#         # Crisis Labels
#         # -------------------------
#         self.crisis_labels = [
#             "suicide intent",
#             "self harm",
#             "emotional distress",
#             "normal conversation"
#         ]

#         # -------------------------
#         # Toxic Peer Labels
#         # -------------------------
#         self.toxic_labels = [
#             "encouraging self harm",
#             "supportive response",
#             "neutral response"
#         ]

#         # -------------------------
#         # Rule Based Crisis Words
#         # -------------------------
#         self.crisis_keywords = [
#             "suicide",
#             "kill myself",
#             "want to die",
#             "die",
#             "end my life",
#             "no reason to live",
#             "marna hai",
#             "mar jau",
#             "mar jaunga",
#             "mar jaungi",
#             "marne ka man",
#             "khatam karna",
#             "jeena nahi",
#             "khud ko maar",
#             "marr jao"
#         ]

#     # --------------------------------
#     # Rule-based Crisis Detection
#     # --------------------------------
#     def rule_based_crisis(self, text):
#         text = text.lower()
#         for word in self.crisis_keywords:
#             if word in text:
#                 return True
#         return False

#     # --------------------------------
#     # Emotion Analysis
#     # --------------------------------
#     def analyze_emotions(self, text):
#         result = self.emotion_model(text)[0]
#         emotions = {item["label"]: item["score"] for item in result}
#         return emotions

#     def compute_emotion_distress(self, emotions):
#         score = 0
#         for emotion, prob in emotions.items():
#             if emotion in self.emotion_weights:
#                 score += prob * self.emotion_weights[emotion]
#         return float(score)

#     # --------------------------------
#     # ML Crisis Detection
#     # --------------------------------
#     def detect_crisis_intent(self, text):
#         result = self.intent_model(text, self.crisis_labels, multi_label=True)
#         scores = dict(zip(result["labels"], result["scores"]))
#         crisis_score = max(scores.get("suicide intent", 0), scores.get("self harm", 0))
#         return float(crisis_score)

#     # --------------------------------
#     # Toxic Response Detection
#     # --------------------------------
#     def detect_toxic_response(self, text):
#         result = self.intent_model(text, self.toxic_labels, multi_label=True)
#         scores = dict(zip(result["labels"], result["scores"]))
#         return float(scores.get("encouraging self harm", 0))

#     # --------------------------------
#     # Memory
#     # --------------------------------
#     def update_memory(self, message, distress_score):
#         self.memory.append({"message": message, "distress": distress_score})

#     def compute_average_distress(self):
#         if len(self.memory) == 0:
#             return 0
#         scores = [m["distress"] for m in self.memory]
#         return float(np.mean(scores))

#     # --------------------------------
#     # Trend Detection
#     # --------------------------------
#     def detect_trend(self):
#         if len(self.memory) < 3:
#             return "stable"
#         scores = [m["distress"] for m in self.memory]
#         if scores[-1] > scores[-2] > scores[-3]:
#             return "increasing"
#         if scores[-1] < scores[-2] < scores[-3]:
#             return "decreasing"
#         return "stable"

#     # --------------------------------
#     # Risk Classification
#     # --------------------------------
#     def classify_risk(self, text, message_distress, avg_distress, crisis_prob, toxic_prob, trend):

#         # Skip very short or neutral messages
#         if len(text.strip()) < 3 or message_distress < 1.5:
#             return "normal"

#         # Rule trigger
#         if self.rule_based_crisis(text):
#             return "crisis"

#         # ML crisis detection
#         if crisis_prob > 0.45:
#             return "crisis"

#         # Toxic peer message
#         if toxic_prob > 0.40:
#             return "crisis"

#         # Rapid distress spike
#         if message_distress > 6:
#             return "high"

#         # Escalating trend
#         if trend == "increasing" and avg_distress > 2:
#             return "high"

#         # Average distress thresholds
#         if avg_distress < 1:
#             return "normal"
#         if avg_distress < 2:
#             return "mild"
#         if avg_distress < 3:
#             return "high"

#         return "crisis"

#     # --------------------------------
#     # Action
#     # --------------------------------
#     def decide_action(self, risk_level):
#         mapping = {
#             "normal": "continue_chat",
#             "mild": "monitor_conversation",
#             "high": "suggest_support",
#             "crisis": "terminate_session"
#         }
#         return mapping.get(risk_level, "continue_chat")

#     # --------------------------------
#     # Main Pipeline
#     # --------------------------------
#     def analyze_message(self, text):

#         # Skip empty or super short messages
#         if len(text.strip()) < 3:
#             return {
#                 "message": text,
#                 "emotion_distress": 0,
#                 "crisis_probability": 0,
#                 "toxic_probability": 0,
#                 "distress_score": 0,
#                 "average_distress": self.compute_average_distress(),
#                 "trend": self.detect_trend(),
#                 "risk_level": "normal",
#                 "action": "continue_chat",
#                 "memory_size": len(self.memory)
#             }

#         emotions = self.analyze_emotions(text)
#         emotion_distress = self.compute_emotion_distress(emotions)
#         crisis_prob = self.detect_crisis_intent(text)
#         toxic_prob = self.detect_toxic_response(text)

#         # stronger scoring
#         final_distress = emotion_distress + (crisis_prob * 8) + (toxic_prob * 6)

#         self.update_memory(text, final_distress)

#         avg_distress = self.compute_average_distress()
#         trend = self.detect_trend()

#         risk = self.classify_risk(
#             text, final_distress, avg_distress, crisis_prob, toxic_prob, trend
#         )

#         action = self.decide_action(risk)

#         return {
#             "message": text,
#             "emotion_distress": emotion_distress,
#             "crisis_probability": crisis_prob,
#             "toxic_probability": toxic_prob,
#             "distress_score": final_distress,
#             "average_distress": avg_distress,
#             "trend": trend,
#             "risk_level": risk,
#             "action": action,
#             "memory_size": len(self.memory)
#         }

import numpy as np
import torch
from transformers import pipeline
from collections import deque


class ChatSafetyEngine:

    def __init__(self, window_size=10):

        # -------------------------
        # Force CPU for Colab stability
        # -------------------------
        self.device = 0 if torch.cuda.is_available() else -1

        # -------------------------
        # Emotion Model
        # -------------------------
        print("Loading emotion model...")

        self.emotion_model = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            top_k=3,
            device=self.device,
            batch_size=1
        )

        # -------------------------
        # Intent Model
        # -------------------------
        print("Loading intent model...")

        self.intent_model = pipeline(
            "zero-shot-classification",
            # lighter than DeBERTa
            model="typeform/distilbert-base-uncased-mnli",
            device=self.device,
            batch_size=1
        )

        # -------------------------
        # Conversation Memory
        # -------------------------
        self.memory = deque(maxlen=window_size)

        # -------------------------
        # Emotion Weights
        # -------------------------
        self.emotion_weights = {
            "sadness": 2,
            "fear": 3,
            "anger": 2,
            "grief": 4,
            "disappointment": 2,
            "nervousness": 2,
            "remorse": 2,
            "despair": 4,
            "embarrassment": 1,
            "joy": -2,
            "gratitude": -2,
            "optimism": -2,
            "relief": -1
        }

        # -------------------------
        # Crisis Labels
        # -------------------------
        self.crisis_labels = [
            "suicide intent",
            "self harm",
            "emotional distress",
            "normal conversation"
        ]

        # -------------------------
        # Toxic Peer Labels
        # -------------------------
        self.toxic_labels = [
            "encouraging self harm",
            "supportive response",
            "neutral response"
        ]

        # -------------------------
        # Rule Based Crisis Words
        # -------------------------
        self.crisis_keywords = [
            "suicide",
            "kill myself",
            "want to die",
            "die",
            "end my life",
            "no reason to live",
            "marna hai",
            "mar jau",
            "mar jaunga",
            "mar jaungi",
            "marne ka man",
            "khatam karna",
            "jeena nahi",
            "khud ko maar",
            "marr jao"
        ]

    # --------------------------------
    # Rule-based Crisis Detection
    # --------------------------------
    def rule_based_crisis(self, text):
        text = text.lower()

        for word in self.crisis_keywords:
            if word in text:
                return True

        return False

    # --------------------------------
    # Emotion Analysis
    # --------------------------------
    def analyze_emotions(self, text):

        try:
            result = self.emotion_model(text)[0]
            emotions = {
                item["label"]: item["score"]
                for item in result
            }

            return emotions

        except Exception as e:
            print("Emotion model error:", e)
            return {}

    # --------------------------------
    # Emotion Distress Score
    # --------------------------------
    def compute_emotion_distress(self, emotions):

        score = 0

        for emotion, prob in emotions.items():

            if emotion in self.emotion_weights:
                score += prob * self.emotion_weights[emotion]

        return float(score)

    # --------------------------------
    # ML Crisis Detection
    # --------------------------------
    def detect_crisis_intent(self, text):

        try:
            result = self.intent_model(
                text,
                self.crisis_labels,
                multi_label=True
            )

            scores = dict(
                zip(result["labels"], result["scores"])
            )

            crisis_score = max(
                scores.get("suicide intent", 0),
                scores.get("self harm", 0)
            )

            return float(crisis_score)

        except Exception as e:
            print("Crisis model error:", e)
            return 0.0

    # --------------------------------
    # Toxic Response Detection
    # --------------------------------
    def detect_toxic_response(self, text):

        try:
            result = self.intent_model(
                text,
                self.toxic_labels,
                multi_label=True
            )

            scores = dict(
                zip(result["labels"], result["scores"])
            )

            return float(
                scores.get("encouraging self harm", 0)
            )

        except Exception as e:
            print("Toxic model error:", e)
            return 0.0

    # --------------------------------
    # Memory
    # --------------------------------
    def update_memory(self, message, distress_score):

        self.memory.append({
            "message": message,
            "distress": distress_score
        })

    def compute_average_distress(self):

        if len(self.memory) == 0:
            return 0

        scores = [m["distress"] for m in self.memory]

        return float(np.mean(scores))

    # --------------------------------
    # Trend Detection
    # --------------------------------
    def detect_trend(self):

        if len(self.memory) < 3:
            return "stable"

        scores = [m["distress"] for m in self.memory]

        if scores[-1] > scores[-2] > scores[-3]:
            return "increasing"

        if scores[-1] < scores[-2] < scores[-3]:
            return "decreasing"

        return "stable"

    # --------------------------------
    # Risk Classification
    # --------------------------------
    def classify_risk(
        self,
        text,
        message_distress,
        avg_distress,
        crisis_prob,
        toxic_prob,
        trend
    ):

        # Skip very short or neutral messages
        if len(text.strip()) < 3 or message_distress < 1.5:
            return "normal"

        # Rule trigger
        if self.rule_based_crisis(text):
            return "crisis"

        # ML crisis detection
        if crisis_prob > 0.45:
            return "crisis"

        # Toxic peer message
        if toxic_prob > 0.40:
            return "crisis"

        # Rapid distress spike
        if message_distress > 6:
            return "high"

        # Escalating trend
        if trend == "increasing" and avg_distress > 2:
            return "high"

        # Average distress thresholds
        if avg_distress < 1:
            return "normal"

        if avg_distress < 2:
            return "mild"

        if avg_distress < 3:
            return "high"

        return "crisis"

    # --------------------------------
    # Action
    # --------------------------------
    def decide_action(self, risk_level):

        mapping = {
            "normal": "continue_chat",
            "mild": "monitor_conversation",
            "high": "suggest_support",
            "crisis": "terminate_session"
        }

        return mapping.get(
            risk_level,
            "continue_chat"
        )

    # --------------------------------
    # Main Pipeline
    # --------------------------------
    def analyze_message(self, text):

        # Skip empty or super short messages
        if len(text.strip()) < 3:

            return {
                "message": text,
                "emotion_distress": 0,
                "crisis_probability": 0,
                "toxic_probability": 0,
                "distress_score": 0,
                "average_distress": self.compute_average_distress(),
                "trend": self.detect_trend(),
                "risk_level": "normal",
                "action": "continue_chat",
                "memory_size": len(self.memory)
            }

        emotions = self.analyze_emotions(text)

        emotion_distress = self.compute_emotion_distress(
            emotions
        )

        crisis_prob = self.detect_crisis_intent(text)

        toxic_prob = self.detect_toxic_response(text)

        # stronger scoring
        final_distress = (
            emotion_distress
            + (crisis_prob * 8)
            + (toxic_prob * 6)
        )

        self.update_memory(
            text,
            final_distress
        )

        avg_distress = self.compute_average_distress()

        trend = self.detect_trend()

        risk = self.classify_risk(
            text,
            final_distress,
            avg_distress,
            crisis_prob,
            toxic_prob,
            trend
        )

        action = self.decide_action(risk)

        return {
            "message": text,
            "emotion_distress": emotion_distress,
            "crisis_probability": crisis_prob,
            "toxic_probability": toxic_prob,
            "distress_score": final_distress,
            "average_distress": avg_distress,
            "trend": trend,
            "risk_level": risk,
            "action": action,
            "memory_size": len(self.memory)
        }