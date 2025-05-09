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
const extraEmojis = ['😡', '😭', '😴', '🥳', '🥰', '🤒'];

function MoodTracker() {
  const [mood, setMood] = useState(null);
  const [comment, setComment] = useState('');
  const [history, setHistory] = useState([]);
  const [showExtras, setShowExtras] = useState(false);
  const [viewMode, setViewMode] = useState('week');
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const getFilteredData = () => {
    const filtered = history.filter((entry) => mainEmojis.includes(entry.mood));
    if (viewMode === 'week') {
      const end = new Date(weekStart);
      end.setDate(end.getDate() + 6);
      return filtered.filter((entry) => {
        const d = new Date(entry.date);
        return d >= weekStart && d <= end;
      });
    } else {
      return filtered.filter((entry) => {
        const d = new Date(entry.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      });
    }
  };

  const filtered = getFilteredData().sort((a, b) => a.date.localeCompare(b.date));

  const chartData = {
    labels: filtered.map((entry) => entry.date),
    datasets: [
      {
        label: 'Оцінка настрою',
        data: filtered.map((entry) => mainEmojis.indexOf(entry.mood) + 1),
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

  const moodIndexes = filtered.map(e => mainEmojis.indexOf(e.mood));
  const maxIndex = Math.max(...moodIndexes);
  const minIndex = Math.min(...moodIndexes);
  
  const bestDays = filtered.filter(e => mainEmojis.indexOf(e.mood) === maxIndex);
  const worstDays = filtered.filter(e => mainEmojis.indexOf(e.mood) === minIndex);
  

  const handleExtraEmoji = (emoji) => {
    setComment((prev) => (prev.includes(emoji) ? prev : prev + ' ' + emoji));
  };

  const formatWeekLabel = (start) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const options = { day: 'numeric', month: 'long' };
    return `${start.toLocaleDateString('uk-UA', options)} – ${end.toLocaleDateString('uk-UA', options)}`;
  };

  const handlePrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
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
          <button className="add-extra" onClick={() => setShowExtras(!showExtras)}>➕</button>
        </div>
        {showExtras && (
          <div className="extra-emojis">
            {extraEmojis.map((emoji, i) => (
              <span
                key={i}
                title="Додатковий настрій"
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
        placeholder="Коментар до настрою (необов'язко)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <label>📊 Перегляд: </label>
        <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value="week">Тиждень</option>
          <option value="month">Місяць</option>
        </select>

        {viewMode === 'month' && (
          <>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{new Date(0, i).toLocaleString('uk-UA', { month: 'long' })}</option>
              ))}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </>
        )}

        {viewMode === 'week' && (
          <div className="mood-week-controls">
            <button onClick={handlePrevWeek}>◀</button>
            <span className="mood-week-label">{formatWeekLabel(weekStart)}</span>
            <button onClick={handleNextWeek}>▶</button>
          </div>
        )}
      </div>

      <h3>📈 Графік змін настрою</h3>
      {filtered.length > 0 ? <Line data={chartData} options={chartOptions} /> : <p>Недостатньо даних.</p>}

      <div className="mood-summary">
        {bestDays.length > 0 && (
          <p>
            🌞 <strong>Найкращі дні:</strong> {bestDays.map(d => d.date).join(', ')}
          </p>
        )}
        {worstDays.length > 0 && (
          <p>
            🌧️ <strong>Найгірші дні:</strong> {worstDays.map(d => d.date).join(', ')}
          </p>
        )}
      </div>

      <h3>📜 Історія настрою</h3>
      <ul className="mood-history">
        {history.sort((a, b) => b.date.localeCompare(a.date)).map((entry, i) => (
          <li key={i}>
            <strong>{entry.date}</strong>: {typeof entry.mood === 'string' ? entry.mood : '❓'} — {entry.comment}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodTracker;