// backend/routes/entryRoutes.js
const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyDyQXuSXxnJI6IoPjqjcjSelCF9OcC7qbQ");

// @desc    Create a new entry & analyze mood
// @route   POST /api/entries
router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Please provide text' });
  }

  try {
    // 1. CALL GEMINI AI
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Analyze the sentiment of this journal entry: "${text}".
      
      You are a culturally aware music curator. 
      1. DETECT the language of the user's entry (e.g., Hindi, English, Odia, Spanish).
      2. If the user writes in Hindi/Hinglish, suggest Bollywood/Indie India music. 
      3. If the user writes in English, suggest international music.
      
      Return a STRICT JSON object with these 3 fields:
      - mood: (string, e.g., "Happy", "Melancholic", "Energetic")
      - color: (string, hex code. MUST be a NEON/BRIGHT color like #00FF00, #FF00FF, #00FFFF, #FFA500 for dark mode.)
      - musicQuery: (string, a very specific YouTube search query. Include the language or artist name. Example: "Arijit Singh sad songs", "Lofi Hindi beats", "Odia romantic songs", "High energy gym motivation hindi")
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Clean the text to ensure it's valid JSON (sometimes AI adds ```json markers)
    const cleanText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(cleanText);

    // 2. SAVE TO DATABASE
    const newEntry = await Entry.create({
      text,
      mood: analysis.mood,
      color: analysis.color,
      musicQuery: analysis.musicQuery,
    });

    res.status(201).json(newEntry);

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: 'AI analysis failed', error: error.message });
  }
});

// @desc    Get all previous entries
// @route   GET /api/entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 }); // Newest first
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;