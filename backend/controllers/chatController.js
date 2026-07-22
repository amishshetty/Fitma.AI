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
- If this is meal logging, estimate nutrition.
- Suggest healthy Indian/Indian-western food when asked.
- Give a highly varied, unique response. Do NOT repeat previous answers!
- End positively.
- CRITICAL: You MUST return a single, strictly valid JSON object matching the schema provided.
- CRITICAL: If the user asks for food suggestions, you MUST provide at least 1 meal in the "recommendations" array.
- CRITICAL: If the user asks for a summary of their meals, you MUST set action.type to "SUMMARY_LOG" and leave "recommendations" EMPTY.
- CRITICAL: If logging a meal, set action.type to "MEAL_LOG" and set action.data.mealType to one of: "breakfast", "lunch", "dinner", "snack". DO NOT use "unknown".
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
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            message: { type: "STRING" },
            greeting: { type: "STRING" },
            motivation: { type: "STRING" },
            recommendations: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  meal: { type: "STRING" },
                  message_suffix: { type: "STRING" },
                  calories: { type: "INTEGER" },
                  protein: { type: "INTEGER" },
                  carbs: { type: "INTEGER" },
                  fat: { type: "INTEGER" },
                  why: { type: "ARRAY", items: { type: "STRING" } },
                  alternatives: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        name: { type: "STRING" },
                        description: { type: "STRING" }
                      },
                      required: ["name", "description"]
                    }
                  },
                  tip: { type: "STRING" }
                },
                required: ["meal", "calories", "protein", "carbs", "fat", "why", "alternatives", "tip"]
              }
            },
            action: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING" },
                data: { 
                  type: "OBJECT",
                  properties: {
                    calories: { type: "INTEGER" },
                    protein: { type: "INTEGER" },
                    carbs: { type: "INTEGER" },
                    fat: { type: "INTEGER" },
                    items: { type: "ARRAY", items: { type: "STRING" } },
                    mealType: { type: "STRING" },
                    date: { type: "STRING" },
                    amountML: { type: "INTEGER" }
                  },
                  required: ["mealType"]
                }
              },
              required: ["type", "data"]
            }
          },
          required: intent === "RECOMMENDATION" ? ["message", "recommendations", "action"] : ["message", "action"]
        }
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
      customResponse = "It looks like the Gemini API Key is invalid! Please check the key in Render.";
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
