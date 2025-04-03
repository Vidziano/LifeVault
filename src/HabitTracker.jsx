import React, { useState, useEffect } from 'react';
import './App.css'; // підключається той самий CSS

const getToday = () => new Date().toISOString().split('T')[0];

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('habits')) || [];
    setHabits(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newHabit.trim(),
      log: {} // ключі: дати, значення: true/false
    };
    setHabits([...habits, newItem]);
    setNewHabit('');
  };

  const toggleDay = (id, date) => {
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;
      const updatedLog = { ...habit.log, [date]: !habit.log[date] };
      return { ...habit, log: updatedLog };
    }));
  };

  const today = getToday();
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const calculateProgress = (log) => {
    const checked = last7Days.filter(date => log[date]).length;
    return { count: checked, percent: Math.round((checked / 7) * 100) };
  };

  const calculateStreak = (log) => {
    let streak = 0;
    for (let i = last7Days.length - 1; i >= 0; i--) {
      const date = last7Days[i];
      if (log[date]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="habit-tracker">
      <h2>🎯 Трекер звичок</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Нова звичка (наприклад, Пити воду)"
        />
        <button onClick={addHabit}>➕ Додати</button>
      </div>

      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Звичка</th>
            {last7Days.map(date => (
              <th key={date}>{date.slice(5)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map(habit => {
            const progress = calculateProgress(habit.log);
            const streak = calculateStreak(habit.log);

            return (
              <React.Fragment key={habit.id}>
                <tr>
                  <td><strong>{habit.name}</strong></td>
                  {last7Days.map(date => (
                    <td key={date}>
                      <input
                        type="checkbox"
                        checked={habit.log[date] || false}
                        onChange={() => toggleDay(habit.id, date)}
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                <td colSpan={8} style={{ padding: '8px 12px' }}>
  <div style={{ marginBottom: '4px', fontSize: '0.9em', color: '#888' }}>
    📊 Прогрес: {progress.count}/7 ({progress.percent}%) &nbsp;&nbsp;
    🔥 Стрік: {streak} днів поспіль
  </div>
  <div className="habit-progress-bar">
    <div
      className={`habit-progress-fill ${
        progress.percent < 40
          ? 'low'
          : progress.percent < 80
          ? 'medium'
          : 'high'
      }`}
      style={{ width: `${progress.percent}%` }}
    ></div>
  </div>
</td>

                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HabitTracker;
