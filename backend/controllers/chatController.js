import { 
  genAI, 
  detectIntent, 
  parseLogs, 
  buildLivaBrain 
} from '../services/chatService.js';

export const handleChat = async (req, res) => {
  const { message, profile, previousMessages = [] } = req.body || {};

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
    const systemPrompt = buildLivaBrain(message, userProfile);

    const history = [];

    previousMessages.forEach((msg) => {
      history.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    });

    // ---------- GEMINI MODEL ----------
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({ history });

    const finalPrompt = `
User Message:
${message}

Remember:
- Speak only as Liva.
- Never mention Gemini.
- Never mention ChatGPT.
- Use the user's motivation style.
- Personalize the reply.
- If this is meal logging, estimate nutrition.
- End positively.
`;

    const result = await Promise.race([
      chat.sendMessage(finalPrompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini Timeout")), 30000))
    ]);
    let response = result.response.text();

    const { cleanResponse, mealData, waterData, deleteData } = parseLogs(response);

    return res.json({
      success: true,
      source: "gemini",
      intent,
      response: cleanResponse,
      mealData,
      waterData,
      deleteData,
    });
  } catch (error) {
    console.error("Liva Error:", error.message || error);

    return res.status(500).json({
      success: false,
      error: "Failed to generate AI response",
      response: "I'm having a little trouble connecting to my brain right now. Can you try again in a moment?"
    });
  }
};
