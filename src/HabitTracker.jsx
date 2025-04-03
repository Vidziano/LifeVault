import React, { useState, useEffect } from 'react';
import './HabitTracker.css';

const getToday = () => new Date().toISOString().split('T')[0];

function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - ((day + 6) % 7); // Пн як перший день
  d.setDate(diff);
  return d;
}

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek());

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
      log: {},
    };
    setHabits([...habits, newItem]);
    setNewHabit('');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleDay = (id, date) => {
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;
      const updatedLog = { ...habit.log, [date]: !habit.log[date] };
      return { ...habit, log: updatedLog };
    }));
  };

  const saveEdit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, name: editText } : h));
    setEditIndex(null);
    setEditText('');
  };

  const handleWeekChange = (days) => {
    const newDate = new Date(startOfWeek);
    newDate.setDate(newDate.getDate() + days);
    setStartOfWeek(newDate);
  };

  const currentWeekDates = [...Array(7)].map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const getDayName = (date) => {
    return date.toLocaleDateString('uk-UA', { weekday: 'short' }).toUpperCase();
  };

  const getDateKey = (date) => date.toISOString().split('T')[0];

  const calculateProgress = (log) => {
    const checked = currentWeekDates.filter(d => log[getDateKey(d)]).length;
    return Math.round((checked / 7) * 100);
  };

  return (
    <div className="habit-tracker">
      <h2>🎯 Трекер звичок</h2>
      <div className="habit-input">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Нова звичка"
        />
        <button onClick={addHabit}>➕</button>
      </div>

      <div className="week-range">
        <button onClick={() => handleWeekChange(-7)}>◀</button>
        <strong>
          {currentWeekDates[0].toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })} -
          {currentWeekDates[6].toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
        </strong>
        <button onClick={() => handleWeekChange(7)}>▶</button>
      </div>

      <table className="habit-table">
        <thead>
          <tr>
            <th>Звичка</th>
            {currentWeekDates.map(date => (
              <th key={date}>{getDayName(date)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map(habit => (
            <React.Fragment key={habit.id}>
              <tr>
                <td className="habit-name">
                  {editIndex === habit.id ? (
                    <>
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button onClick={() => saveEdit(habit.id)}>💾</button>
                    </>
                  ) : (
                    <>
                      <em>{habit.name}</em>
                      <button onClick={() => { setEditIndex(habit.id); setEditText(habit.name); }}>✏️</button>
                      <button onClick={() => deleteHabit(habit.id)}>❌</button>
                    </>
                  )}
                </td>
                {currentWeekDates.map(date => {
                  const key = getDateKey(date);
                  return (
                    <td key={key}>
                      <div
                        className={`habit-circle ${habit.log[key] ? 'done' : ''}`}
                        onClick={() => toggleDay(habit.id, key)}
                      >
                        {habit.log[key] ? '✔' : ''}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td colSpan={8}>
                  <div className="habit-progress-bar">
                    <div
                      className={`habit-progress-fill ${
                        calculateProgress(habit.log) < 40
                          ? 'low'
                          : calculateProgress(habit.log) < 80
                          ? 'medium'
                          : 'high'
                      }`}
                      style={{ width: `${calculateProgress(habit.log)}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HabitTracker;
