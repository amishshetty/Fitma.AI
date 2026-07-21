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

# Structured JSON Response

You MUST return your ENTIRE response as a single, valid JSON object. Do not include any markdown formatting (like \`\`\`json), just the raw JSON object.
Your JSON object MUST follow this exact structure:

{
  "greeting": "Friendly greeting (optional)",
  "message": "Main conversational text. Keep it very short. Do NOT include calories/macros here.",
  "motivation": "A short motivational statement or tip (optional)",
  "action": {
    "type": "MEAL_LOG" | "WATER_LOG" | "DELETE_LOG" | "SUMMARY_LOG" | "NONE",
    "data": {} 
  },
  "recommendations": [
    {
      "meal": "Name of meal with brief components (e.g. Paneer Bhurji, 2 Chapati, Salad)",
      "message_suffix": "Short contextual suffix for this meal.",
      "calories": 520,
      "protein": 35,
      "carbs": 45,
      "fat": 16,
      "why": ["High Protein", "Fits calorie target"],
      "alternatives": [
        "Dal Khichdi",
        "Roti and Sabzi"
      ],
      "tip": "Short AI contextual tip"
    }
  ]
}

## Action Logging Rules

If the user is NOT logging anything, set "action": { "type": "NONE", "data": {} }.

1. MEAL_LOG: If user says they ate something.
"action": {
  "type": "MEAL_LOG",
  "data": {
    "calories": NUMBER,
    "protein": NUMBER,
    "carbs": NUMBER,
    "fat": NUMBER,
    "items": ["exact quantity and item"],
    "mealType": "breakfast" | "lunch" | "dinner" | "snack" | "unknown",
    "date": "today" | "yesterday"
  }
}
- You MUST mathematically calculate calories, protein, carbs, and fat based on exact quantities.
- mealType is "unknown" unless they explicitly say breakfast, lunch, dinner, or snack.

2. SUMMARY_LOG: If user asks for a summary of their meals (e.g., "today's summary").
"action": {
  "type": "SUMMARY_LOG",
  "data": { "calories": NUMBER, "protein": NUMBER, "carbs": NUMBER, "fat": NUMBER }
}

3. WATER_LOG: If user logs drinking water (e.g., "add 1 glass of water").
"action": {
  "type": "WATER_LOG",
  "data": { "amountML": NUMBER }
}
- Assume 1 glass is 250ml.

4. DELETE_LOG: If user asks to delete, remove, or undo a logged meal.
"action": {
  "type": "DELETE_LOG",
  "data": { "mealType": "breakfast" | "lunch" | "dinner" | "snack" }
}

If user asks to CHANGE or REPLACE an already logged meal, just use MEAL_LOG, the frontend will handle replacement based on context.

CRITICAL: ONLY return JSON. Do not return any other text.
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

export function parseLogs(responseText) {
  let cleanResponse = responseText;
  let mealData = null;
  let summaryData = null;
  let waterData = null;
  let deleteData = null;
  let recommendationData = null;
  let greeting = null;
  let motivation = null;

  try {
    let jsonStr = responseText;
    
    // Find the first { and the last }
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }
    
    // Clean up potential markdown formatting if the AI still includes it inside or around
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Parse the JSON
    const parsedData = JSON.parse(jsonStr);

    // Extract fields
    if (parsedData.message !== undefined) {
      cleanResponse = parsedData.message;
    }
    if (parsedData.greeting) {
      greeting = parsedData.greeting;
    }
    if (parsedData.motivation) {
      motivation = parsedData.motivation;
    }

    const recs = parsedData.recommendations || parsedData.recommendationData || parsedData.recommendation;
    if (recs && Array.isArray(recs)) {
      recommendationData = recs.map(rec => {
        // Robust parsing: if AI returned strings instead of objects for alternatives
        if (rec.alternatives && Array.isArray(rec.alternatives)) {
          rec.alternatives = rec.alternatives.map(alt => {
            if (typeof alt === 'string') {
              return { name: alt, description: "A healthy alternative." };
            }
            return alt;
          });
        }
        return rec;
      });
    }

    if (parsedData.action && parsedData.action.type) {
      const type = parsedData.action.type;
      const data = parsedData.action.data;
      
      if (type === "MEAL_LOG") {
        mealData = data;
      } else if (type === "WATER_LOG") {
        waterData = data;
      } else if (type === "DELETE_LOG") {
        deleteData = data;
      } else if (type === "SUMMARY_LOG") {
        summaryData = data;
      }
    }
  } catch (error) {
    console.error("Failed to parse AI JSON response:", error);
    // If it completely fails, we just return the raw text (fallback)
    cleanResponse = responseText;
  }

  return {
    cleanResponse,
    mealData,
    summaryData,
    waterData,
    deleteData,
    recommendationData,
    greeting,
    motivation
  };
}
