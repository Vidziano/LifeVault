import React, { useState, useEffect } from 'react';
import './MoodTracker.css';

function MoodTracker() {
  const [mood, setMood] = useState(null);
  const [comment, setComment] = useState('');
  const [history, setHistory] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  const moodEmojis = ['😵', '😡', '😭', '😖', '🤒', '😞', '😕', '😴', '🥳', '🥰', '🙂', '😊', '😄'];
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('moodHistory')) || [];
    setHistory(stored);
    const todayEntry = stored.find(entry => entry.date === today);
    if (todayEntry) {
      setMood(todayEntry.mood);
      setComment(todayEntry.comment);
    }
  }, []);

  useEffect(() => {
    if (mood !== null) {
      const updated = history.filter(entry => entry.date !== today);
      updated.push({ date: today, mood, comment });
      setHistory(updated);
      localStorage.setItem('moodHistory', JSON.stringify(updated));
    }
  }, [mood, comment]);

  return (
    <div className="mood-tracker">
      <h2>😊 Трекер настрою</h2>
      <p>Оціни свій настрій на сьогодні ({today}):</p>

      <div className="mood-emojis">
        {moodEmojis.map((emoji, i) => (
          <span
            key={i}
            title={`Оцінка: ${i + 1}`}
            className={`emoji-rating ${mood === i + 1 ? 'selected' : ''}`}
            onClick={() => setMood(i + 1)}
          >
            {emoji}
          </span>
        ))}
      </div>

      <textarea
        placeholder="Коментар до настрою (необов'язково)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <h3>📊 Історія настрою</h3>
      <ul className="mood-history">
        {history
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((entry, i) => (
            <li key={i}>
              <strong>{entry.date}</strong>: {moodEmojis[entry.mood - 1]} — {entry.comment}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default MoodTracker;
