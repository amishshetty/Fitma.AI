import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

async function test() {
  const prompt = `
You are Liva.
EXPECTED JSON FORMAT:
{
  "mealData": {
    "name": "Food name",
    "mealType": "breakfast | lunch | dinner | snack | unknown"
  }
}
User Message: i had poha for dinner yesterday`;
  
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite', generationConfig: { responseMimeType: 'application/json' } });
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}
test();
