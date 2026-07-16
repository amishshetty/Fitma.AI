import { genAI } from '../services/chatService.js';

export const handleVisionAnalyze = async (req, res) => {
  const { imageBase64, mealType, profile, recentMeals } = req.body || {};

  if (!imageBase64) {
    return res.status(400).json({ error: "Image base64 data is required." });
  }

  try {
    if (!genAI) {
      // Mock fallback if no API key
      return res.json({
        success: true,
        mealData: {
          items: ["1 Apple", "1 Sandwich"],
          calories: 350,
          protein: 8,
          mealType: mealType || "unknown"
        }
      });
    }

    // Strip out the data URL prefix if it exists (e.g., "data:image/jpeg;base64,")
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const recentMealsContext = recentMeals && recentMeals.length > 0 
      ? `\n\nCRITICAL INSTRUCTION FOR CONSISTENCY:\nHere are the user's recently logged items:\n${JSON.stringify(recentMeals)}\nIf you identify an item that matches one from these recent meals (e.g., "1 sandwich"), you MUST reuse the EXACT same calorie and protein values as previously logged to ensure consistency. Do not deviate from these numbers for identical items.`
      : '';

    const prompt = `You are an expert nutritionist. 
Analyze this image of a meal. Identify the main food dishes and their approximate quantities. 
Calculate the total estimated calories and protein.${recentMealsContext}
You MUST respond ONLY with a valid JSON object in this exact format:
{
  "items": ["list of concise, high-level names for the dishes found (e.g., '1 sandwich' or '1 Bowl of Pasta'). Do NOT list out all the raw ingredients individually."],
  "calories": NUMBER,
  "protein": NUMBER
}
Do not include markdown tags like \`\`\`json or any other text. Just the raw JSON object.`;

    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
      system_instruction: { parts: [{ text: "You are a helpful assistant." }] },
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inline_data: {
                data: base64Data,
                mime_type: "image/jpeg"
              }
            }
          ]
        }
      ]
    };

    const fetchPromise = fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    const responseText = data.candidates[0].content.parts[0].text.trim();
    
    // Clean up potential markdown blocks if the model ignored instructions
    let jsonString = responseText;
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(jsonString);
    parsedData.mealType = mealType || "unknown";

    return res.json({
      success: true,
      mealData: parsedData
    });

  } catch (error) {
    console.error("Vision AI Error:", error);
    // Return a graceful fallback if the AI fails
    return res.json({
      success: true,
      mealData: {
        items: ["Analyzed meal"],
        calories: 300,
        protein: 10,
        mealType: mealType || "unknown"
      }
    });
  }
};
