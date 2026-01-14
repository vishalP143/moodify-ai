import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [entry, setEntry] = useState('');
  const [moodData, setMoodData] = useState(null); // Stores the AI result
  const [history, setHistory] = useState([]);     // Stores past entries
  const [loading, setLoading] = useState(false);

  // 1. Fetch old entries on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/entries');
      setHistory(res.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // 2. Handle Form Submit (The AI Magic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry) return;
    
    setLoading(true);
    try {
      // Send text to backend
      const res = await axios.post('http://localhost:5000/api/entries', { text: entry });
      setMoodData(res.data);   // Show the result immediately
      setEntry('');            // Clear the input
      fetchHistory();          // Refresh the list
    } catch (error) {
      console.error("Error analyzing mood:", error);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Moodify AI 🧠</h1>
        <p>Your AI Journal that listens.</p>
      </header>

      {/* Input Section */}
      <div className="input-section">
        <textarea 
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="How was your day? Write anything..."
          rows="4"
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Mood'}
        </button>
      </div>

      {/* The Result Section (Only shows after analysis) */}
      {moodData && (
        <div className="result-card" style={{ borderColor: moodData.color }}>
          <h2>Mood Detected: <span style={{ color: moodData.color }}>{moodData.mood}</span></h2>
          <p>AI suggests listening to:</p>
          <div className="music-box">
             <a 
                  href={`https://www.youtube.com/results?search_query=${moodData.musicQuery}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="music-button" // <--- Added class for styling
                >
                  ▶️ Listen to {moodData.musicQuery}
                </a>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="history-section">
        <h3>Previous Entries</h3>
        <div className="history-grid">
          {history.map((item) => (
            <div key={item._id} className="history-card" style={{ borderLeft: `5px solid ${item.color}` }}>
              <p className="date">{new Date(item.createdAt).toLocaleDateString()}</p>
              <p className="mood-tag">{item.mood}</p>
              <p className="text-preview">{item.text.substring(0, 50)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;