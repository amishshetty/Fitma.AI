import dotenv from "dotenv";
dotenv.config();

async function testGemini() {
  console.log("Starting test...");
  
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
  console.log("API Key exists:", !!apiKey);
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent`;
  
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: "I ate 2 eggs for breakfast" }]
      }
    ]
  };

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(body)
    });
    
    console.log(`Response received in ${Date.now() - startTime}ms`);
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

testGemini();
