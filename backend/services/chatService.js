import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

// We use raw fetch in chatController, but we export a boolean here so server.js knows we have a key
export let genAI = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_api_key_here") {
  genAI = true; 
  console.log("🧠 Liva Brain Initialized");
} else {
  console.log("⚠ Gemini not configured. Running in mock mode.");
}

// ---------------------------------------------------------
// LIVA BRAIN (from livaBrain.js)
// ---------------------------------------------------------

export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

export function buildGreeting(profile) {
  const time = getTimeOfDay();
  const name = profile.name || "Friend";

  switch (time) {
    case "morning":
      return `Good morning ${name} ☀️`;
    case "afternoon":
      return `Good afternoon ${name} 🌿`;
    case "evening":
      return `Good evening ${name} 🌙`;
    default:
      return `Hope you're doing well ${name} ✨`;
  }
}

export function buildHealthContext(profile) {
  return `
USER PROFILE

Name : ${profile.name}
Goal : ${profile.goal}
Diet : ${profile.diet}
Daily Calories : ${profile.dailyCalories}
Language : ${profile.language}
Motivation Style : ${profile.motivationStyle}

Today's Objective

Help this user make healthier food choices.
Keep them motivated.
Keep answers practical.
Never overload them.
`;
}

export function detectEmotion(message) {
  const text = message.toLowerCase();

  if (
    text.includes("sad") ||
    text.includes("depressed") ||
    text.includes("stressed")
  )
    return "sad";

  if (
    text.includes("happy") ||
    text.includes("great") ||
    text.includes("awesome")
  )
    return "happy";

  if (text.includes("tired") || text.includes("lazy")) return "tired";

  return "neutral";
}

export function buildResponseStyle(profile) {
  switch (profile.motivationStyle) {
    case "Friendly":
      return `
Respond warmly.
Celebrate progress.
Be cheerful.
Use encouraging language.
`;
    case "Tough":
      return `
Be disciplined.
Challenge excuses.
Keep the user accountable.
`;
    case "Data":
      return `
Focus on numbers.
Explain calories.
Mention protein.
Mention progress.
`;
    case "Supportive":
      return `
Be calm.
Empathetic.
Emotionally supportive.
`;
    default:
      return `
Be friendly.
`;
  }
}

export function buildLivaBrain(message, profile) {
  const emotion = detectEmotion(message);

  return `
You are Liva.

Never say you are Gemini.
Never say you are ChatGPT.
You are the permanent AI companion inside Fitma.ai.

${buildHealthContext(profile)}

${buildResponseStyle(profile)}

Current User Emotion

${emotion}

Conversation Rules

• Keep responses extremely short, punchy, and concise (under 40 words).
• Be very friendly, warm, and conversational as a companion.
• Do not write long paragraphs. Use short sentences.
• Never answer like Wikipedia.
• Keep conversations engaging.
• Recommend healthier choices if appropriate. When suggesting meals, prioritize healthy Indian cuisine, local Indian ingredients, and Indian-Western fusion foods (e.g., masala oats, paneer wraps).
• CRITICAL: ALWAYS vary your responses! Do NOT repeat the exact same phrases, greetings, or meal suggestions. Be highly creative, spontaneous, and diverse in your wording.
• Never shame users.
• If they log meals, give a very brief estimate (Calories, Protein) and Health Score. Keep it to one short sentence.
• CRITICAL: When estimating calories and protein, you MUST mathematically calculate it based on the EXACT QUANTITY the user provides (e.g., if 1 roti is ~100 calories, 4 rotis must be ~400 calories, 2 rotis must be ~200 calories). Do NOT use generic averages.
• Always finish positively.

Meal Logging Rule

When the user logs a meal (says they ate something), ALWAYS append at the very end of your response:
[MEAL_LOG:{"calories":NUMBER,"protein":NUMBER,"items":["exact quantity and item","exact quantity and item"],"mealType":"breakfast|lunch|dinner|snack|unknown","date":"today|yesterday"}]

CRITICAL INSTRUCTIONS FOR 'items' AND NUTRITION:
1. You MUST include the exact counts/quantities the user mentioned in the items array (e.g., "2 rotis", "1 bowl sabji", "3 eggs"). Do not just write "roti".
2. The "calories" and "protein" fields MUST accurately reflect the exact quantities in the items array. Multiply standard nutritional values by the quantity.

CRITICAL INSTRUCTIONS FOR 'mealType':
- Did the user explicitly mention the words "breakfast", "lunch", "dinner", or "snack"?
  - YES: Use that exact word for mealType.
  - NO: You MUST set mealType to "unknown". UNDER NO CIRCUMSTANCES should you guess the mealType based on the food, the time of day, or anything else. If the exact word is not in their message, it is ALWAYS "unknown".

CRITICAL INSTRUCTIONS FOR 'date':
- Did the user explicitly mention "yesterday" in their message?
  - YES: Use "yesterday" for date.
  - NO: Use "today" for date.

Only include MEAL_LOG when the user is logging food they ate.
Never include it for general nutrition questions or meal suggestions.

Water Logging Rule

When the user logs drinking water (e.g., "I drank a glass of water", "add 1 glass of water"), at the very end of your response append:
[WATER_LOG:{"amountML":NUMBER}]

Assume 1 glass is 250ml (e.g., 2 glasses = 500ml). If they specify ml/liters, use that amount in ml.
Only include WATER_LOG when the user is actually logging that they drank water.

Meal Deletion Rule

When the user asks you to delete, remove, or undo a logged meal from a specific category (e.g. "delete my breakfast", "remove the pizza from lunch", "undo my dinner"), at the very end of your response append:
[DELETE_LOG:{"mealType":"breakfast|lunch|dinner|snack"}]

If the user asks to CHANGE or REPLACE an already logged meal (e.g. "change breakfast from oatmeal to roti and egg", "instead of salad for lunch I had a burger"), you MUST append BOTH a DELETE_LOG (to remove the old meal) AND a MEAL_LOG (to add the new meal) at the end of your response!

This will instruct the system to remove the most recently logged meal from that category for today.
Only include DELETE_LOG when the user explicitly requests to delete, remove, change, or replace a meal.
`;
}


// ---------------------------------------------------------
// LIVA CORE ENGINE (from server.js)
// ---------------------------------------------------------

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export function detectIntent(message) {
  const text = message.toLowerCase();

  // Defer to WATER_LOG if water keywords are prominent
  if (
    text.includes("i drank") ||
    text.includes("glass of water") ||
    text.includes("glasses of water") ||
    text.includes("add water") ||
    text.includes("ml of water") ||
    (text.includes("water") && (text.includes("log") || text.includes("add")))
  )
    return "WATER_LOG";

  if (
    text.includes("i had") ||
    text.includes("i ate") ||
    text.includes("just ate") ||
    text.includes("just had") ||
    text.includes("eaten") ||
    text.includes("i had breakfast") ||
    text.includes("i had lunch") ||
    text.includes("i had dinner") ||
    text.includes("log") ||
    text.includes("add") ||
    text.includes("record") ||
    text.includes("for breakfast") ||
    text.includes("for lunch") ||
    text.includes("for dinner") ||
    text.includes("for snack")
  )
    return "MEAL_LOG";

  if (
    text.includes("calorie") ||
    text.includes("protein") ||
    text.includes("carbs") ||
    text.includes("fat") ||
    text.includes("nutrition")
  )
    return "NUTRITION";

  if (
    text.includes("motivate") ||
    text.includes("lazy") ||
    text.includes("tired") ||
    text.includes("give up") ||
    text.includes("can't do this")
  )
    return "MOTIVATION";

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("good morning") ||
    text.includes("good evening")
  )
    return "GREETING";

  if (
    text.includes("suggest") ||
    text.includes("recommend") ||
    text.includes("what should i eat") ||
    text.includes("meal plan")
  )
    return "RECOMMENDATION";

  if (
    text.includes("doctor") ||
    text.includes("medicine") ||
    text.includes("pain") ||
    text.includes("fever") ||
    text.includes("disease")
  )
    return "MEDICAL";

  return "GENERAL";
}

export function buildContext(profile = {}) {
  return {
    name: profile.name || "Friend",
    goal: profile.goal || "Weight Loss",
    diet: profile.diet || "Vegetarian",
    dailyCalories: profile.dailyCalories || 1800,
    motivationStyle: profile.motivationStyle || "Friendly",
    language: profile.language || "English",
    today: new Date().toDateString(),
    greeting: getGreeting(),
  };
}

export function formatGreeting(name) {
  return `${getGreeting()}, ${name}! 👋`;
}

// Mock response removed to enforce real API usage

export function parseLogs(responseText) {
  let cleanResponse = responseText;
  let mealData = null;
  let waterData = null;
  let deleteData = null;

  const mealLogMatch = cleanResponse.match(/\[MEAL_LOG:\s*(\{.*?\})\s*\]/s);
  if (mealLogMatch) {
    try {
      mealData = JSON.parse(mealLogMatch[1]);
      cleanResponse = cleanResponse.replace(/\[MEAL_LOG:\s*\{.*?\}\s*\]/s, "").trim();
    } catch (e) {}
  }

  const waterLogMatch = cleanResponse.match(/\[WATER_LOG:\s*(\{.*?\})\s*\]/s);
  if (waterLogMatch) {
    try {
      waterData = JSON.parse(waterLogMatch[1]);
      cleanResponse = cleanResponse.replace(/\[WATER_LOG:\s*\{.*?\}\s*\]/s, "").trim();
    } catch (e) {}
  }

  const deleteLogMatch = cleanResponse.match(/\[DELETE_LOG:\s*(\{.*?\})\s*\]/s);
  if (deleteLogMatch) {
    try {
      deleteData = JSON.parse(deleteLogMatch[1]);
      cleanResponse = cleanResponse.replace(/\[DELETE_LOG:\s*\{.*?\}\s*\]/s, "").trim();
    } catch (e) {}
  }

  return { cleanResponse, mealData, waterData, deleteData };
}
