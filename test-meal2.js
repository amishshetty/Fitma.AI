import dotenv from "dotenv";
import { buildLivaBrain } from "./backend/services/chatService.js";

dotenv.config();

async function testMealLog() {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent`;
  
  const systemPrompt = buildLivaBrain(
    "I had 2 rotis and paneer for dinner",
    { name: "Amish", goal: "Weight Loss", diet: "Standard", dailyCalories: 2000, motivationStyle: "Friendly", language: "English" },
    [],
    2000
  );

  const finalPrompt = `
User Message:
I had 2 rotis and paneer for dinner

Remember:
- Speak only as Liva.
- Never mention Gemini or ChatGPT.
- Use the user's motivation style.
- Personalize the reply.
- CRITICAL: Always contextualize your response based on the user's primary journey (Weight Loss). For example, if they selected "Lose Weight", acknowledge their weight loss journey naturally. If they selected "Gain Muscle", motivate them for muscle gain, etc.
- If this is meal logging, estimate nutrition.
- Suggest healthy Indian/Indian-western food when asked.
- Give a highly varied, unique response. Do NOT repeat previous answers!
- End positively.
- CRITICAL: You MUST return a single, strictly valid JSON object.
- CRITICAL: If the user asks for food suggestions, you MUST provide at least 1 meal in the "recommendations" array.
- CRITICAL: If the user asks for a summary of their meals, you MUST set action.type to "SUMMARY_LOG" and leave "recommendations" EMPTY.
- CRITICAL: If logging a meal, set action.type to "MEAL_LOG" and set action.data.mealType to one of: "breakfast", "lunch", "dinner", "snack". DO NOT use "unknown".
`;

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(body)
    });
    
    console.log(`Response received in ${Date.now() - startTime}ms`);
    console.log("Status:", response.status);
    const data = await response.json();
    if (data.error) {
      console.error(JSON.stringify(data.error, null, 2));
    } else {
      console.log(data.candidates[0].content.parts[0].text);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

testMealLog();
