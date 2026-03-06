import axios from "axios";

// Hardcoded Gemini API key
const GEMINI_API_KEY = "AIzaSyBqDme6y8TRS7w3wBdF3D1j7Po5lMA8mz0";

/**
 * Builds the reflective journal prompt
 */
function buildPrompt(lastJournal, trajectory) {
  return `
You are a behavioral psychologist who writes reflective emotional narratives.

Your task is to help the user understand themselves through a short story-like reflection.

Use the user's latest journal entry as the **starting moment**, then gently expand the reflection
to describe the deeper emotional patterns this moment reveals about them.

The writing should feel like someone thoughtfully narrating the user's inner emotional world,
as if explaining them to themselves.

It should feel personal, calm, and insightful — like a page from a self-understanding book.

Do NOT summarize the journal entry.
Instead, use the situation in the journal as a window into the user's emotional tendencies.

Infer things like:
• how they usually process emotions
• how they deal with stress internally
• their thinking style
• emotional habits that appear over time

Use the trajectory signals to guide your understanding, but NEVER mention the signals directly.

Journal Entry:
${lastJournal}

Emotional Trajectory Signals:
Dominant Emotion: ${trajectory.dominant_emotion}
Weighted Sentiment: ${trajectory.weighted_sentiment}
Stability Score: ${trajectory.stability_score}
Volatility: ${trajectory.volatility}
Risk Momentum: ${trajectory.risk_momentum}

Return ONLY this JSON:

{
"Title": "3-5 word emotional theme",
"Narrative": "A 140-180 word reflective narrative written as if someone is describing the user's emotional nature."
}

Return ONLY valid JSON.
`;
}

/**
 * Generates emotional insights using Gemini
 */
export const generateInsights = async (lastJournal, trajectory) => {

  const prompt = buildPrompt(lastJournal, trajectory);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };

  try {

    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      throw new Error("Empty AI response");
    }

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;

    const insight = JSON.parse(text.substring(start, end));

    return [insight];

  } catch (error) {

    console.error("AI Engine Error:", error.message);

    return [
      {
        Title: "No Insight Available",
        Narrative: "Insight could not be generated at this time."
      }
    ];
  }
};