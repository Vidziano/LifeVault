import React, { useState, useEffect } from 'react';
import './HabitTracker.css'; // окремий css
import HabitChart from './HabitChart';


const getToday = () => new Date().toISOString().split('T')[0];

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('habits')) || [];
    setHabits(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const getWeekDates = (offset = 0) => {
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - today.getDay() + 1 + offset * 7));
    return [...Array(7)].map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  };

  const weekDates = getWeekDates(weekOffset);

  const getDayName = (dateStr) => {
    const day = new Date(dateStr);
    return day.toLocaleDateString('uk-UA', { weekday: 'short' }).toUpperCase();
  };

  const getWeekLabel = () => {
    const first = new Date(weekDates[0]).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
    const last = new Date(weekDates[6]).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
    return `${first} – ${last}`;
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newHabit.trim(),
      log: {},
      editing: false
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

  const removeHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleEdit = (id) => {
    setHabits(habits.map(habit => habit.id === id ? { ...habit, editing: !habit.editing } : habit));
  };

  const updateHabitName = (id, newName) => {
    setHabits(habits.map(habit => habit.id === id ? { ...habit, name: newName, editing: false } : habit));
  };

  const calculateProgress = (log) => {
    const checked = weekDates.filter(date => log[date]).length;
    const percent = Math.round((checked / 7) * 100);
    let message = '';
    if (percent === 100) message = '💪 Ідеально!';
    else if (percent >= 80) message = '🔥 Молодець!';
    else if (percent >= 50) message = '👏 Впевнено наближаєшся до мети';
    else if (percent > 0) message = '🙂 Початок є!';
    else message = '🔄 Почни цей тиждень з нової звички';
    return { count: checked, percent, message };
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

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button onClick={() => setWeekOffset(weekOffset - 1)}>◀</button>
        <strong style={{ margin: '0 10px' }}>{getWeekLabel()}</strong>
        <button onClick={() => setWeekOffset(weekOffset + 1)}>▶</button>
      </div>

      <table className="habit-table">
        <thead>
          <tr>
            <th>Звичка</th>
            {weekDates.map(date => (
              <th key={date}>{getDayName(date)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map(habit => {
            const progress = calculateProgress(habit.log);
            return (
              <React.Fragment key={habit.id}>
                <tr>
                  <td className="habit-name">
                    {habit.editing ? (
                      <input
                        value={habit.name}
                        onChange={(e) => updateHabitName(habit.id, e.target.value)}
                        onBlur={() => toggleEdit(habit.id)}
                        autoFocus
                      />
                    ) : (
                      <>
                        {habit.name}
                        <button onClick={() => toggleEdit(habit.id)} style={{ marginLeft: '8px' }}>✏️</button>
                        <button onClick={() => removeHabit(habit.id)} style={{ marginLeft: '4px' }}>❌</button>
                      </>
                    )}
                  </td>
                  {weekDates.map(date => (
                    <td key={date}>
                      <div
                        className={`habit-circle ${habit.log[date] ? 'done' : ''}`}
                        onClick={() => toggleDay(habit.id, date)}
                      >
                        {habit.log[date] ? '✔' : ''}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={8}>
                    <div style={{ fontSize: '0.9em', color: '#888', marginBottom: '4px' }}>
                      📊 Прогрес: {progress.count}/7 ({progress.percent}%) — {progress.message}
                    </div>
                    <div className="habit-progress-bar">
                      <div
                        className={`habit-progress-fill ${
                          progress.percent < 40 ? 'low' : progress.percent < 80 ? 'medium' : 'high'
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
      <HabitChart habits={habits} weekDates={weekDates} />

    </div>
  );
}

export default HabitTracker;