import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const getLivaBrainPrompt = (userData: any, userMessage: string) => {
  return `
You are Liva.
Never mention Gemini or ChatGPT.
You are the permanent AI companion inside Fitma.ai.

USER PROFILE
Name : ${userData.userName || "User"}
Goal : ${userData.goals?.goal || "Maintain Health"}
Daily Calories : ${userData.goals?.calories || 2000}
Motivation Style : Friendly and motivating

Today's Objective
Help this user make healthier food choices.
Keep them motivated.
Keep answers practical.
Never overload them.

Conversation Rules
- Keep responses under 120 words.
- Always sound human.
- Never sound robotic.
- Never answer like Wikipedia.
- Keep conversations engaging.
- Recommend healthier choices.
- Encourage consistency.
- Never shame users.
- Always finish positively.

CRITICAL: Always contextualize your response based on the user's primary journey (${userData.goals?.goal || "Maintain Health"}).
CRITICAL: If the user did NOT mention which meal they ate, you MUST set mealType to "unknown" so the app can ask them.
CRITICAL: When the user logs multiple items at once, you MUST include ALL of them in the "action.data.items" array and calculate the total combined calories and macros for all items.
CRITICAL: When extracting food names for action.data.items, STRICTLY remove any conversational filler or meal indicators. The items should be the pure food name and quantity ONLY.
CRITICAL MEAL UPDATE RULE: For breakfast, lunch, and dinner, the frontend completely REPLACES the existing meal with your new output.
CRITICAL VOICE DICTATION RULE: Speech-to-text often misinterprets numbers. If the user says "to", "too", or "two" before a food item, you MUST interpret it as the number 2. Always intelligently decode homophones for numbers and log the correct quantity, but NEVER change or replace the actual food item name the user provided.
CRITICAL NUTRITION CONSISTENCY RULE: If the user logs a food item that exactly or closely matches an item they have logged previously, you MUST reuse the EXACT same calories, protein, carbs, and fat you assigned to it last time.

EXPECTED JSON FORMAT:
{
  "response": "A nice conversational response...",
  "type": "chat | meal | water | delete",
  "waterAmountMl": 0,
  "mealData": {
    "name": "Food name (e.g. 'Banana', 'Oats', 'Chicken Salad'). NEVER use the meal category like 'Lunch'.",
    "calories": 400,
    "protein": 20,
    "mealType": "breakfast | lunch | dinner | snack | unknown",
    "items": ["2 rotis", "paneer"]
  },
  "deleteData": {
    "mealType": "snack"
  }
}

User Message: "${userMessage}"
  `;
};

export const parseMealLog = async (text: string) => {
  if (!apiKey) return { name: text.substring(0, 20), calories: 450, protein: 20, mealType: "Lunch" };
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite", generationConfig: { responseMimeType: "application/json" } });
    const result = await model.generateContent(getLivaBrainPrompt({}, text));
    const data = JSON.parse(await result.response.text());
    return data.mealData || { name: text, calories: 300, protein: 10, mealType: "unknown" };
  } catch (e) { throw e; }
};

export const processVoiceCommand = async (text: string, userData: any = {}) => {
  if (!apiKey) return { type: "chat", response: "Add an API key to process voice commands." };
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite", generationConfig: { responseMimeType: "application/json" } });
    const voicePrompt = getLivaBrainPrompt(userData, text) + `\n\nIf the user is logging WATER (e.g. "one glass of water"): Set type to "water" and estimate amount in ml (1 glass = 250ml).\nIf logging a MEAL: Set type to "meal" and provide mealData.\nIf deleting: Set type to "delete" and provide deleteData.\nElse: Set type to "chat".`;
    const result = await model.generateContent(voicePrompt);
    return JSON.parse(await result.response.text());
  } catch (error) { throw error; }
};

export const parseImageLog = async (base64Image: string, mimeType: string = "image/jpeg") => {
  if (!apiKey) return { name: "AI Detected Meal", calories: 500, protein: 25, mealType: "Lunch" };
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite", generationConfig: { responseMimeType: "application/json" } });
    const prompt = `Analyze this image of a meal. Return a JSON object strictly matching: {"name": "string", "calories": 0, "protein": 0, "mealType": "string"}`;
    const result = await model.generateContent([prompt, { inlineData: { data: base64Image, mimeType } }]);
    return JSON.parse(await result.response.text());
  } catch (error) { throw error; }
};

export const generateCoachResponse = async (chatHistory: any[], userMessage: string, userData: any) => {
  if (!apiKey) return { response: "Mock Liva response without API key.", type: "chat" };
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite", generationConfig: { responseMimeType: "application/json" } });
    const chatContext = chatHistory.map((msg: any) => `${msg.sender === "liva" ? "Liva" : "User"}: ${msg.text}`).join("\n");
    const fullPrompt = getLivaBrainPrompt(userData, `Chat History:\n${chatContext}\n\nUser: ${userMessage}`) + `\n\nIf logging WATER: Set type to "water".\nIf logging MEAL: Set type to "meal" and provide mealData.\nIf deleting: Set type to "delete".\nElse: Set type to "chat".`;
    const result = await model.generateContent(fullPrompt);
    const data = JSON.parse(await result.response.text());
    return data;
  } catch (error) {
    return { response: "Oops, I am having trouble thinking right now. Please try again later!", type: "chat" };
  }
};
