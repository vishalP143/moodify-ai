// backend/checkModels.js
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
  console.log("Checking available models for your key...");
  
  try {
    // We use the raw API URL to verify exactly what Google sees
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();

    if (data.error) {
        console.error("API Error:", data.error.message);
        return;
    }

    console.log("\n=== YOUR AVAILABLE MODELS ===");
    const available = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    available.forEach(model => {
      // We only care about models that generate text
      console.log(`Model Name: ${model.name.replace('models/', '')}`);
    });
    console.log("=============================\n");
    console.log("Pick one of the names above and use it in your code.");

  } catch (error) {
    console.error("Network Error:", error.message);
  }
}

checkModels();