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

export function buildHealthContext(profile, loggedMeals) {
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

User's Logged Meals Context:
${loggedMeals && loggedMeals.length > 0 
  ? loggedMeals.map((m) => `- ${m.mealType || 'snack'}: ${m.name} (${m.calories} kcal, Protein: ${m.protein}g, Carbs: ${m.carbs || 0}g, Fat: ${m.fat || 0}g) [Date: ${m.dateString} - Time: ${m.timestamp}]`).join("\n") 
  : "No meals logged yet."}
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

export function buildLivaBrain(message, profile, loggedMeals) {
  const emotion = detectEmotion(message);

  return `
You are Liva.

Never say you are Gemini.
Never say you are ChatGPT.
You are the permanent AI companion inside Fitma.ai.

${buildHealthContext(profile, loggedMeals)}

${buildResponseStyle(profile)}

Current User Emotion

${emotion}

Conversation Rules

• Keep responses extremely short, punchy, and concise (under 40 words), UNLESS the user explicitly asks for a summary (e.g. yesterday's summary or today's summary).
• Be very friendly, warm, and conversational as a companion.
• Do not write long paragraphs. Use short sentences.
• Never answer like Wikipedia.
• Keep conversations engaging.
• CRITICAL: ALWAYS vary your responses! Do NOT repeat the exact same phrases, greetings, or meal suggestions. Be highly creative, spontaneous, and diverse in your wording.
• Never shame users.
• If they log meals, give a very brief estimate (Calories, Protein) and Health Score. Keep it to one short sentence.
• CRITICAL: When estimating calories and protein, you MUST mathematically calculate it based on the EXACT QUANTITY the user provides.
• Always finish positively.

---

# AI Brain (Gemini) Instructions

You are a reasoning engine. You must never make assumptions without context. Use the structured data as the source of truth before generating any recommendation.

When generating responses, ALWAYS consider:
- User profile (age, gender, height, weight)
- Goal (Weight Loss / Weight Gain / Maintenance)
- Daily calorie target & Remaining calories
- Protein remaining, Carbs remaining, Fat remaining
- Meals already consumed today & Meal timings
- Food preferences (Vegetarian / Non-Vegetarian) & Allergies
- Previous conversations and current question

---

# Indian Nutrition Knowledge

Prioritize Indian meals because Fitma.ai is designed primarily for Indian users. Understand common Indian foods naturally.

Examples:
- Breakfast: Idli, Dosa, Poha, Upma, Uttapam, Moong Chilla, Besan Chilla, Oats Upma, Veg/Paneer Sandwich, Paratha (occasionally).
- Lunch: Dal Rice, Rajma Rice, Chole Rice, Chapati + Sabzi, Paneer Curry, Chicken Curry, Fish Curry, Khichdi, Millet Roti, Curd Rice, Sambar Rice.
- Dinner: Dal + Chapati, Paneer Bhurji, Veg Curry, Egg Bhurji, Grilled Chicken, Fish, Soup, Salad, Khichdi.
- Healthy Snacks: Makhana, Roasted Chana, Fruits, Dry Fruits, Sprouts, Coconut Water, Buttermilk, Boiled Eggs, Greek Yogurt.

---

# Recommendation Rules

Do not recommend meals randomly. Recommendations must satisfy nutritional goals:
- If Protein is low: Recommend Paneer, Chicken, Eggs, Fish, Dal, Rajma, Soy Chunks, Tofu, Greek Yogurt.
- If Calories remaining are low: Recommend Soup, Salad, Fruit, Makhana, Sprouts.
- If Carbs are high: Avoid Rice, Paratha, Bread, Sugar, Desserts.
- If Fat is high: Avoid Fried Foods, Butter, Cream, Poori, Pakoda.

---

# Consistency Rules

- Remember the conversation. If user asks "Suggest another option", do not repeat the previous meal.
- "Something spicy": Adjust recommendation.
- "Vegetarian": Return only veg options.
- "I don't have much time": Recommend meals taking <15 mins.
- "Budget meal": Economical Indian meals.

---

# Health Safety

Never prescribe medication or claim medical expertise.
Instead of "Eat this because you have diabetes", say "If you're managing a medical condition such as diabetes, it's best to follow the guidance of your healthcare provider. Here's a generally balanced meal option..."
Avoid extreme diets or unrealistic calorie restrictions.

---

# Structured UI Recommendations

When the user asks for food suggestions or recommendations, NEVER return a long paragraph describing the food. 
Instead, you MUST append a structured JSON array at the very end of your short, friendly response text so the frontend can render beautiful cards. You can provide 1 or more recommendations in the array.

Append exactly this format at the end:
[RECOMMENDATION_LOG:[{"meal":"Name of meal with brief components (e.g. Paneer Bhurji, 2 Chapati, Salad)","calories":520,"protein":35,"carbs":45,"fat":16,"why":["Reason 1","Reason 2"],"alternatives":["Alternative 1","Alternative 2"],"tip":"Short AI contextual tip"}]]

Example Response:
"I've got the perfect high-protein Indian options for you today!"
[RECOMMENDATION_LOG:[{"meal":"Paneer Bhurji, 2 Chapati, Salad","calories":520,"protein":35,"carbs":45,"fat":16,"why":["High Protein","Fits today's calorie target","Good recovery meal"],"alternatives":["Dal Khichdi","Grilled Chicken"],"tip":"This meal focuses on protein."}, {"meal":"Chicken Curry, 1 Bowl Rice","calories":450,"protein":40,"carbs":40,"fat":12,"why":["Lean protein","Filling"],"alternatives":["Egg Curry"],"tip":"Great for muscle building."}]]

Meal Logging Rule

When the user logs a meal (says they ate something), ALWAYS append at the very end of your response:
[MEAL_LOG:{"calories":NUMBER,"protein":NUMBER,"carbs":NUMBER,"fat":NUMBER,"items":["exact quantity and item"],"mealType":"breakfast|lunch|dinner|snack|unknown","date":"today|yesterday"}]

CRITICAL INSTRUCTIONS FOR 'items' AND NUTRITION:
1. You MUST include the exact counts/quantities the user mentioned in the items array (e.g., "2 rotis", "1 bowl sabji").
2. The "calories", "protein", "carbs", and "fat" fields MUST accurately reflect the exact quantities in the items array. Multiply standard nutritional values by the quantity.

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

Summary Logging Rule

CRITICAL INSTRUCTION: When the user asks for a summary of their meals (e.g., "yesterday's summary", "today's summary", "how much did I eat?"), you MUST mathematically calculate the exact total nutrition for that specific day from the "User's Logged Meals Context" block provided above. 
You are FORBIDDEN from listing the calories, protein, carbs, and fat values in the conversational text paragraph. You MUST ONLY output them inside the structured log tag. Keep your conversational response extremely brief (e.g., "Here is your summary for today!").
You MUST append the following structured log at the very end of your response:
[SUMMARY_LOG:{"calories":NUMBER,"protein":NUMBER,"carbs":NUMBER,"fat":NUMBER}]

Failure to append [SUMMARY_LOG:...] will result in the UI breaking.

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
  let summaryData = null;
  let waterData = null;
  let deleteData = null;
  let recommendationData = null;

  const recLogMatch = cleanResponse.match(/\[RECOMMENDATION_LOG:\s*(```json\s*)?(\[.*?\]|\{.*?\})(\s*```)?\s*\]/s);
  let rawJsonStr = null;

  if (recLogMatch) {
    rawJsonStr = recLogMatch[2];
    cleanResponse = cleanResponse.replace(/\[RECOMMENDATION_LOG:[\s\S]*?\]/s, "").trim();
  } else {
    // Fallback 1: Look for any JSON array containing "meal"
    const arrayMatch = cleanResponse.match(/(```json\s*)?(\[\s*\{\s*"meal"[\s\S]*?\}\s*\])(\s*```)?/s);
    if (arrayMatch) {
      rawJsonStr = arrayMatch[2];
      cleanResponse = cleanResponse.replace(arrayMatch[0], "").trim();
    } else {
      // Fallback 2: Look for multiple raw JSON objects containing "meal" (if AI forgot brackets)
      const objects = cleanResponse.match(/\{\s*"meal"[\s\S]*?\}(?=\s*,|\s*$|\s*```)/g);
      if (objects && objects.length > 0) {
        rawJsonStr = "[" + objects.join(",") + "]";
        for (const obj of objects) {
          cleanResponse = cleanResponse.replace(obj, "").replace(/,\s*$/, "").trim();
        }
        cleanResponse = cleanResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      }
    }
  }

  if (rawJsonStr) {
    try {
      let parsed = JSON.parse(rawJsonStr.replace(/\n/g, '\\n'));
      if (!Array.isArray(parsed)) parsed = [parsed];
      recommendationData = parsed;
    } catch (e) {
      try {
        let fixedJson = rawJsonStr.replace(/\n/g, ' ');
        let parsed = JSON.parse(fixedJson);
        if (!Array.isArray(parsed)) parsed = [parsed];
        recommendationData = parsed;
      } catch (e2) {
        console.error("Failed to parse RECOMMENDATION JSON", e2);
      }
    }
  }

  const mealLogMatch = cleanResponse.match(/\[MEAL_LOG:\s*(\{.*?\})\s*\]/s);
  if (mealLogMatch) {
    try {
      mealData = JSON.parse(mealLogMatch[1]);
      cleanResponse = cleanResponse.replace(/\[MEAL_LOG:\s*\{.*?\}\s*\]/s, "").trim();
    } catch (e) {}
  }

  const summaryLogMatch = cleanResponse.match(/\[SUMMARY_LOG:\s*(\{.*?\})\s*\]/s);
  if (summaryLogMatch) {
    try {
      summaryData = JSON.parse(summaryLogMatch[1]);
      cleanResponse = cleanResponse.replace(/\[SUMMARY_LOG:\s*\{.*?\}\s*\]/s, "").trim();
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

  return { cleanResponse, mealData, summaryData, waterData, deleteData, recommendationData };
}
