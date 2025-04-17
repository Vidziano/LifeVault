import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import './MoodTracker.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

const mainEmojis = ['😵', '😞', '🙂', '😊', '😄'];
const extraEmojis = ['😡', '😭', '😴', '🥳', '🥰', '🤯', '🤒'];

function MoodTracker() {
  const [mood, setMood] = useState(null);
  const [comment, setComment] = useState('');
  const [history, setHistory] = useState([]);
  const [showExtras, setShowExtras] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('moodHistory')) || [];
    setHistory(stored);
    const todayEntry = stored.find((entry) => entry.date === today);
    if (todayEntry) {
      setMood(todayEntry.mood);
      setComment(todayEntry.comment);
    }
  }, []);

  useEffect(() => {
    if (mood !== null && typeof mood === 'string') {
      const updated = history.filter((entry) => entry.date !== today);
      updated.push({ date: today, mood, comment });
      setHistory(updated);
      localStorage.setItem('moodHistory', JSON.stringify(updated));
    }
  }, [mood, comment]);

  const recent = history
    .filter((entry) => mainEmojis.includes(entry.mood))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  const chartData = {
    labels: recent.map((entry) => entry.date),
    datasets: [
      {
        label: 'Оцінка настрою',
        data: recent.map((entry) => mainEmojis.indexOf(entry.mood) + 1),
        borderColor: '#4e4eeb',
        backgroundColor: '#4e4eeb',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          callback: (value) => mainEmojis[value - 1] || '',
        },
        min: 1,
        max: mainEmojis.length,
      },
    },
  };

  const bestDay = [...history]
    .filter((entry) => mainEmojis.includes(entry.mood))
    .sort((a, b) => mainEmojis.indexOf(b.mood) - mainEmojis.indexOf(a.mood))[0];

  const worstDay = [...history]
    .filter((entry) => mainEmojis.includes(entry.mood))
    .sort((a, b) => mainEmojis.indexOf(a.mood) - mainEmojis.indexOf(b.mood))[0];

  const handleExtraEmoji = (emoji) => {
    setComment((prev) => (prev.includes(emoji) ? prev : prev + ' ' + emoji));
  };

  return (
    <div className="mood-tracker">
      <h2>😊 Трекер настрою</h2>
      <p>Оціни свій настрій на сьогодні ({today}):</p>

      <div className="mood-emojis">
        <div className="main-emojis">
          {mainEmojis.map((emoji, i) => (
            <span
              key={i}
              title={`Оцінка ${i + 1}`}
              className={`emoji-rating ${mood === emoji ? 'selected' : ''}`}
              onClick={() => setMood(emoji)}
            >
              {emoji}
            </span>
          ))}
          <button className="add-extra" onClick={() => setShowExtras(!showExtras)}>
            ➕
          </button>
        </div>

        {showExtras && (
          <div className="extra-emojis">
            {extraEmojis.map((emoji, i) => (
              <span
                key={i}
                title="Додатковий настрій (не враховується у графік)"
                className="emoji-extra"
                onClick={() => handleExtraEmoji(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      <textarea
        placeholder="Коментар до настрою (необов'язково)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <h3>📈 Графік змін настрою (останні 7 днів)</h3>
      {recent.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Недостатньо даних для побудови графіка.</p>
      )}

      <div className="mood-summary">
        {bestDay && (
          <p>
            🌞 <strong>Найкращий день:</strong> {bestDay.date} — {bestDay.mood}
          </p>
        )}
        {worstDay && (
          <p>
            🌧️ <strong>Найгірший день:</strong> {worstDay.date} — {worstDay.mood}
          </p>
        )}
      </div>

      <h3>🧾 Історія настрою</h3>
      <ul className="mood-history">
        {history
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((entry, i) => (
            <li key={i}>
              <strong>{entry.date}</strong>: {typeof entry.mood === 'string' ? entry.mood : '❓'} — {entry.comment}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default MoodTracker;
