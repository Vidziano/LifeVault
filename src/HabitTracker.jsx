import React, { useState, useEffect } from 'react';
import './HabitTracker.css';
import HabitChart from './HabitChart';

const getToday = () => new Date().toISOString().split('T')[0];

const recommendedHabits = [
  'Пити воду',
  'Ранкова зарядка',
  'Читати книгу',
  'Медитація',
  'Прогулянка',
  'Лягати до 23:00',
  'Писати щоденник',
  'Вивчати англійську',
  'Жодного цукру',
  'Фокус 25 хв'
];

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [warning, setWarning] = useState('');
  const [warningPos, setWarningPos] = useState({ x: 0, y: 0 });
  


  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('habits')) || [];
    setHabits(stored);
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
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
    setShowSuggestions(false);
  };

  const addRecommendedHabit = (habitText) => {
    setNewHabit(habitText);
    setShowSuggestions(false);
  };

  const toggleDay = (id, date, event) => {
    const today = getToday();
    if (date !== today) {
      const rect = event.target.getBoundingClientRect();
      setWarning('❌ Мітки можна ставити лише за сьогодні');
      setWarningPos({ x: rect.left + rect.width / 2, y: rect.top - 10 }); // трохи над клітинкою
      setTimeout(() => setWarning(''), 2500);
      return;
    }
  
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
    setHabits(habits.map(habit => habit.id === id ? { ...habit, editing: true } : habit));
  };

  const updateHabitName = (id, newName) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, name: newName } : habit
    ));
  };

  const finishEditing = (id) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, editing: false } : habit
    ));
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
      {warning && (
  <div
    className="habit-toast"
    style={{ left: `${warningPos.x}px`, top: `${warningPos.y}px` }}
  >
    {warning}
  </div>
)}



      <div className="habit-input">
  <input
    type="text"
    value={newHabit}
    onChange={(e) => setNewHabit(e.target.value)}
    placeholder="Нова звичка"
  />
  <button onClick={addHabit}>➕</button>

  {/* 👇 Обгортаємо кнопку і список у wrapper */}
  <div className="suggestions-wrapper">
    <button onClick={() => setShowSuggestions(!showSuggestions)} style={{ marginLeft: '5px' }}>
      📋
    </button>
    {showSuggestions && (
      <div className="habit-suggestions">
        {recommendedHabits.map((habit, idx) => (
          <div key={idx} className="habit-suggestion" onClick={() => addRecommendedHabit(habit)}>
            {habit}
          </div>
        ))}
      </div>
    )}
  </div>
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
                        onBlur={() => finishEditing(habit.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') finishEditing(habit.id);
                        }}
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
                  {weekDates.map((date) => {
  const isToday = date === getToday();

  return (
    <td key={date}>
      <div
        className={`habit-circle ${habit.log[date] ? 'done' : ''} ${isToday ? 'is-today' : ''}`}
        onClick={(e) => toggleDay(habit.id, date, e)}
        title={!isToday ? 'Мітки можна ставити лише за сьогодні' : undefined}
      >
        {habit.log[date] ? '✔' : ''}
      </div>
    </td>
  );
})}


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
