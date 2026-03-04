
// import fetch from "node-fetch";

// const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDuO6a_CI42UYasUgCBa99kTXuL-WfzAGc";

// /**
//  * 🧠 analyzeJournal(journalText)
//  * Sends the user's journal entry to Gemini for analysis.
//  * Returns an array of { Trigger, Scene, Solution } objects.
//  */
// export async function analyzeJournal(journalText) {
//   if (!journalText) throw new Error("Missing journal text");

//   const payload = {
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: `
// You are a cognitive coach. Analyze the following journal entry and generate exactly three cards.

// Each card must have:
// 1. "Trigger": 3–4 word title summarizing the emotional trigger.
// 2. "Scene": 2–3 sentence explanation of the context.
// 3. "Solution": step-by-step guidance (Step 1: ..., Step 2: ..., Step 3: ...).

// Return ONLY valid JSON, no extra text.

// Journal Entry:
// "${journalText}"
//             `,
//           },
//         ],
//       },
//     ],
//   };

//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     }
//   );

//   const rawText = await response.text();
//   console.log("🧠 Gemini raw response:", rawText);

//   // Clean text response
//   let cleaned = rawText.replace(/```json|```/g, "").trim();

//   if (
//     (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
//     (cleaned.startsWith("'") && cleaned.endsWith("'"))
//   ) {
//     cleaned = cleaned.slice(1, -1).replace(/\\"/g, '"');
//   }

//   let parsedCards = [];
//   try {
//     parsedCards = JSON.parse(cleaned);
//     if (!Array.isArray(parsedCards)) parsedCards = [];
//   } catch (e) {
//     console.error("❌ JSON parse error:", e);
//     parsedCards = [];
//   }

//   return parsedCards;
// }

import fetch from "node-fetch";

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDuO6a_CI42UYasUgCBa99kTXuL-WfzAGc";

export async function analyzeJournal(journalText) {
  if (!journalText) throw new Error("Missing journal text");

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
You are a cognitive coach. Analyze the following journal entry and generate exactly three cards.

Each card must have:
1. "Trigger": 3–4 word title summarizing the emotional trigger.
2. "Scene": 2–3 sentence explanation of the context.
3. "Solution": step-by-step guidance (Step 1: ..., Step 2: ..., Step 3: ...).

Return ONLY valid JSON — an array of 3 objects, no markdown, no code fences.

Journal Entry:
"${journalText}"
            `,
          },
        ],
      },
    ],
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  console.log(`🔎 Gemini Status: ${res.status} ${res.statusText}`);
  const rawText = await res.text();
  console.log("🧠 Gemini raw (first 600 chars):", rawText.slice(0, 600));

  // Step 1️⃣ Try to parse the whole API response
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(rawText);
  } catch (err) {
    console.error("❌ Failed to parse Gemini full JSON:", err);
    return [];
  }

  // Step 2️⃣ Extract the text that contains the inner JSON array
  const textPart =
    parsedResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  console.log("🧩 Extracted textPart (first 400 chars):", textPart.slice(0, 400));

  // Step 3️⃣ Clean common formatting issues
  let cleaned = textPart.replace(/```json|```/g, "").trim();

  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).replace(/\\"/g, '"');
  }

  // Step 4️⃣ Extract JSON array using regex (in case text has extra commentary)
  const arrayMatch = cleaned.match(/\[\s*{[\s\S]*}\s*\]/);
  const jsonString = arrayMatch ? arrayMatch[0] : cleaned;

  console.log("🧹 Cleaned JSON snippet (first 300 chars):", jsonString.slice(0, 300));

  // Step 5️⃣ Parse the inner JSON array safely
  let parsedCards = [];
  try {
    parsedCards = JSON.parse(jsonString);
    console.log("🤖 Parsed AI Cards:", parsedCards);
  } catch (err) {
    console.error("❌ JSON parse error:", err);
    console.error("🧾 Problematic text snippet:", jsonString.slice(0, 500));
  }

  return Array.isArray(parsedCards) ? parsedCards : [];
}