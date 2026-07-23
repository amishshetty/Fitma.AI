import { 
  genAI, 
  detectIntent, 
  parseLogs, 
  buildLivaBrain 
} from '../services/chatService.js';

export const handleChat = async (req, res) => {
  const { message, profile, previousMessages = [], loggedMeals = [], remainingCalories } = req.body || {};

  if (!message || message.trim() === "") {
    return res.status(400).json({
      error: "Message is required.",
    });
  }

  const userProfile = profile || {
    name: "User",
    goal: "Health",
    diet: "Standard",
    dailyCalories: 2000,
    motivationStyle: "Friendly",
    language: "English",
  };

  const intent = detectIntent(message);

  try {
    // ---------- GEMINI MODEL ----------
    const systemPrompt = buildLivaBrain(message, userProfile, loggedMeals, remainingCalories);

    const history = [];

    previousMessages.forEach((msg) => {
      history.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    });

    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent`;

    const finalPrompt = `
User Message:
${message}

Remember:
- Speak only as Liva.
- Never mention Gemini or ChatGPT.
- Use the user's motivation style.
- Personalize the reply.
- CRITICAL: Always contextualize your response based on the user's primary journey (${userProfile.goal}). For example, if they selected "Lose Weight", acknowledge their weight loss journey naturally. If they selected "Gain Muscle", motivate them for muscle gain, etc.
- If this is meal logging, estimate nutrition.
- Suggest healthy Indian/Indian-western food when asked.
- Give a highly varied, unique response. Do NOT repeat previous answers!
- End positively.
- CRITICAL: You MUST return a single, strictly valid JSON object matching the schema provided.
- CRITICAL: If the user asks for food suggestions, you MUST provide at least 1 meal in the "recommendations" array.
- CRITICAL: If the user is just logging a meal or water, or asking for a summary, you MUST leave "recommendations" EMPTY. Only provide recommendations if EXPLICITLY asked.
- CRITICAL: If logging a meal, set action.type to "MEAL_LOG" and set action.data.mealType to one of: "breakfast", "lunch", "dinner", "snack". If the user did NOT mention which meal they ate (e.g. "I had 2 rotis"), you MUST set mealType to "unknown" so the app can ask them.

EXPECTED JSON FORMAT:
{
  "message": "A nice conversational response...",
  "greeting": "Optional greeting",
  "motivation": "Optional motivation",
  "recommendations": [
    {
      "meal": "Paneer Tikka",
      "message_suffix": "is great",
      "calories": 300,
      "protein": 15,
      "carbs": 10,
      "fat": 20,
      "why": ["High protein"],
      "alternatives": [{ "name": "Tofu", "description": "Vegan option" }],
      "tip": "Eat with salad"
    }
  ],
  "action": {
    "type": "MEAL_LOG",
    "data": {
      "calories": 400,
      "protein": 20,
      "carbs": 40,
      "fat": 15,
      "items": ["2 rotis", "paneer"],
      "mealType": "unknown",
      "date": "today",
      "amountML": 0
    }
  }
}
`;

    const contents = history.map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));
    contents.push({ role: "user", parts: [{ text: finalPrompt }] });

    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: contents,
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const fetchPromise = fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(body)
    });

    const result = await Promise.race([
      fetchPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini Timeout")), 30000))
    ]);

    const data = await result.json();
    if (!result.ok) {
      throw new Error(data.error?.message || "Google API Error");
    }

    let response = data.candidates[0].content.parts[0].text;

    const { cleanResponse, mealData, summaryData, waterData, deleteData, recommendationData, greeting, motivation } = parseLogs(response);

    return res.json({
      success: true,
      source: "gemini",
      intent,
      response: cleanResponse,
      greeting,
      motivation,
      mealData,
      summaryData,
      waterData,
      deleteData,
      recommendationData,
    });
  } catch (error) {
    console.error("Liva Error:", error.message || error);

    const errorMessage = error.message || "Unknown error";
    let customResponse = "I'm having a little trouble connecting to my brain right now. Can you try again in a moment?";
    
    if (errorMessage.includes("API key not valid")) {
      customResponse = "It looks like the Gemini API Key is invalid! Please check the key in Vercel.";
    } else {
      // Temporarily send the raw error to the frontend so we can see what's wrong!
      customResponse = `System Error: ${errorMessage}`;
    }

    return res.status(500).json({
      success: false,
      error: "Failed to generate AI response",
      response: customResponse
    });
  }
};
