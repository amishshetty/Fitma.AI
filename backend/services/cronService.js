import cron from "node-cron";
import User from "../models/User.js";
import MealLog from "../models/Meal.js";
import { sendPushNotification } from "./pushService.js";
import dotenv from "dotenv";

dotenv.config();

// Function to generate a proactive message using Gemini
const generateProactiveMessage = async (userName, mealType) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return `Hey ${userName}, it's time for your ${mealType}! Don't forget to log it.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY.trim()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Write a short, engaging, 1-sentence notification reminding a user named ${userName} to log their ${mealType}. Keep it friendly and motivating as an AI diet coach named Liva.` }] }]
        })
      }
    );
    const data = await response.json();
    return data.candidates[0].content.parts[0].text.replace(/["*]/g, '');
  } catch (err) {
    console.error("Cron Gemini Error:", err);
    return `Hey ${userName}, it's time for your ${mealType}! Don't forget to log it.`;
  }
};

export const startCronJobs = () => {
  // Run every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    console.log("⏰ Running Proactive Coach Cron Job");
    try {
      const currentHour = new Date().getHours();
      // Only send notifications between 8 AM and 9 PM
      if (currentHour < 8 || currentHour >= 21) return;

      let expectedMeal = "";
      if (currentHour >= 8 && currentHour <= 10) expectedMeal = "breakfast";
      else if (currentHour >= 12 && currentHour <= 14) expectedMeal = "lunch";
      else if (currentHour >= 19 && currentHour <= 21) expectedMeal = "dinner";

      if (!expectedMeal) return; // Not a meal time

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Find all users who have a push subscription
      const users = await User.find({ pushSubscription: { $ne: null } });

      for (const user of users) {
        // Check if user has already logged this meal today
        const hasLogged = await MealLog.exists({
          userId: user._id,
          mealType: expectedMeal,
          loggedAt: { $gte: startOfDay }
        });

        if (!hasLogged) {
          const message = await generateProactiveMessage("Friend", expectedMeal);
          console.log(`Sending push to User ${user._id}: ${message}`);
          
          await sendPushNotification(user.pushSubscription, {
            title: "Liva 🌿",
            body: message,
            icon: "/pwa-192x192.png",
            badge: "/pwa-192x192.png"
          });
        }
      }
    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  });
  
  console.log("🕒 Cron Jobs Initialized");
};
