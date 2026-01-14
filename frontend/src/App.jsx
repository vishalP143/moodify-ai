import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [entry, setEntry] = useState('');
  const [moodData, setMoodData] = useState(null); 
  const [history, setHistory] = useState([]);     
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

  // 2. Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry) return;
    
    setLoading(true);
    try {
      // Send text to backend
      const res = await axios.post('http://localhost:5000/api/entries', { text: entry });
      setMoodData(res.data);   
      setEntry('');            
      fetchHistory();          
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

      {/* Result Section */}
      {moodData && (
        <div className="result-card" style={{ borderColor: moodData.color }}>
          <h2>
            Mood Detected: <span style={{ color: moodData.color }}>{moodData.mood}</span>
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
            AI curated this mix for you:
          </p>
          
          {/* --- VIDEO PLAYER FIXED FOR DIRECT IDS --- */}
          <div className="video-container">
            <iframe 
              width="100%" 
              height="350" 
              // We remove 'listType' and just use the ID directly
              src={`https://www.youtube.com/embed/${moodData.musicQuery}?autoplay=1`} 
              title="Music Player"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          
          {/* Backup Link */}
          <a 
             className="backup-link"
             href={`https://www.youtube.com/watch?v=${moodData.musicQuery}`}
             target="_blank" 
             rel="noopener noreferrer"
          >
            (Video not playing? Click here to watch on YouTube)
          </a>
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