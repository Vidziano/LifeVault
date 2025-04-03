import React, { useState, useEffect } from 'react';

const initialHabits = [
  { id: 1, name: 'Пити воду', streak: 0, xp: 0, lastCompleted: null },
  { id: 2, name: '10 хв фокуса', streak: 0, xp: 0, lastCompleted: null },
];

function HabitTracker() {
  const [habits, setHabits] = useState(() => {
    const stored = localStorage.getItem('habits');
    return stored ? JSON.parse(stored) : initialHabits;
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const handleComplete = (id) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;

        const today = new Date().toDateString();
        if (habit.lastCompleted === today) return habit;

        const isNextDay =
          new Date(habit.lastCompleted).toDateString() ===
          new Date(Date.now() - 86400000).toDateString();

        const newStreak = isNextDay ? habit.streak + 1 : 1;
        const newXP = habit.xp + 10;

        return {
          ...habit,
          streak: newStreak,
          xp: newXP,
          lastCompleted: today,
        };
      })
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>🎯 Трекер звичок</h2>
      {habits.map(habit => {
        const level = Math.floor(habit.xp / 100);
        const progress = habit.xp % 100;

        return (
          <div key={habit.id} style={{
            background: '#fff',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px',
            boxShadow: '0 0 5px rgba(0,0,0,0.1)'
          }}>
            <h3>{habit.name}</h3>
            <p>🔥 Стрік: {habit.streak} днів</p>
            <p>⭐ Рівень: {level} (XP: {progress}/100)</p>
            <button
              onClick={() => handleComplete(habit.id)}
              disabled={habit.lastCompleted === new Date().toDateString()}
              style={{
                backgroundColor: '#4e4eeb',
                color: '#fff',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: habit.lastCompleted === new Date().toDateString() ? 'not-allowed' : 'pointer'
              }}
            >
              ✅ Виконано сьогодні
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default HabitTracker;
