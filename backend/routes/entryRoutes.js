const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- SAFE VIDEO DICTIONARY (Radio Mode) ---
// These are single LONG videos (1+ hour mixes) that are safe to embed.
const VIDEO_IDS = {
  "happy_pop": "ZbZSe6N_BXs",      // Happy Upbeat Pop 1 Hour Mix
  "sad_piano": "4xDxP51gU_k",      // Sad Piano & Rain (3 Hours)
  "energetic_gym": "I58Zc2678_4",  // Workout Phonk Mix
  "calm_lofi": "jfKfPfyJRdk",      // Lofi Girl 24/7 Radio (Reliable)
  "angry_rock": "P5h4PFBjHq0",     // High Energy Rock Mix
  "romantic_hindi": "BddP6PYo2gs", // Bollywood Lofi Flip
  "sad_hindi": "775i7h5Y5uU",      // Arijit Singh Sad Mix
};

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Please provide text' });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use 2.5-flash (Stable)

    // --- AI PROMPT ---
    const prompt = `
      Analyze the sentiment of this journal entry: "${text}".
      
      You are a DJ. Pick ONE category from this list that best matches the mood:
      ["happy_pop", "sad_piano", "energetic_gym", "calm_lofi", "angry_rock", "romantic_hindi", "sad_hindi"]
      
      Rules:
      - If user writes in Hindi/Hinglish, prefer the "_hindi" options.
      - Default to "calm_lofi" if unsure.
      
      Return a STRICT JSON object:
      {
        "mood": "Short mood name",
        "color": "Neon Hex Code",
        "category": "The exact category string from the list above"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(cleanText);

    // --- MAP CATEGORY TO VIDEO ID ---
    const videoId = VIDEO_IDS[analysis.category] || VIDEO_IDS["calm_lofi"];

    const newEntry = await Entry.create({
      text,
      mood: analysis.mood,
      color: analysis.color,
      musicQuery: videoId, // Saving the ID (e.g., "jfKfPfyJRdk")
    });

    res.status(201).json(newEntry);

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: 'AI analysis failed', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;