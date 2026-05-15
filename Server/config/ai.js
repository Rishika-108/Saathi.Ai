import axios from "axios";

// Hardcoded Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

/**
 * Builds the public undercurrent prompt (Connect Page)
 */
function buildUndercurrentPrompt(journals, trajectory) {
  const combinedText = journals.map((j, i) => `Journal ${i + 1}: ${j.text}`).join("\n\n");

  return `
You are a master of emotional prose and psychological subtext. 
Your task is to describe a person's current "emotional undercurrent" based on their recent reflections.

Context: 
Someone is viewing this person's profile in a peer support community. 
They need to feel a deep, human connection to this person's internal world without reading their private journals.

Style Guide:
- Write in the THIRD PERSON ("They").
- Use subtle, evocative, and literary language — like a passage from a novel about someone's inner life.
- NEVER use clinical or medical terms (no "anxiety", "depression", "disorder").
- NEVER mention journaling, writing, or the platform itself.
- Focus on the "quiet" emotions — the ones that sit underneath the surface, the feelings between the feelings.
- Describe HOW they carry their emotions through everyday moments, not WHAT happened to them.
- Be specific about the texture of the feeling. Not "they felt sad" but "there was a heaviness they carried into every room, the kind that makes even laughter feel borrowed."

Example of the exact tone you must match:
"He wasn't devastated in the dramatic sense. It was quieter than that — a slow embarrassment sitting underneath everything he did that day. Even ordinary conversations felt difficult, as if everyone could somehow see the disappointment he was trying to hide."

Input Data (private — DO NOT reference or quote directly):
${combinedText}

Trajectory Context (use as emotional compass, NEVER mention these terms):
Dominant Emotion: ${trajectory.dominant_emotion}
Stability: ${trajectory.stability_score}
Volatility: ${trajectory.volatility || "unknown"}
Weighted Sentiment: ${trajectory.weighted_sentiment || "unknown"}

Output Rules:
- Write 3-5 sentences (80-120 words).
- Capture the "emotional weather" of this person — the quiet truth of how they are moving through life right now.
- Be specific about the feeling, never about the events.
- Return ONLY the narrative text, no titles, no labels, no JSON.
`;
}

/**
 * Generates the public emotional undercurrent narrative
 */
export const generatePublicUndercurrent = async (journals, trajectory) => {
  const prompt = buildUndercurrentPrompt(journals, trajectory);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await axios.post(url, {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    }, { timeout: 15000 });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return text || "Navigating a quiet period of inner reflection.";
  } catch (error) {
    console.error("Undercurrent AI Error:", error.message);
    return "Reflecting on life's subtle shifts and quiet moments.";
  }
};
