import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendarview.css';

const themeKeys = ['робота', 'навчання', 'особисте', 'інше'];

function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [tasks, setTasks] = useState({});
  const [newEvent, setNewEvent] = useState('');
  const [newTask, setNewTask] = useState('');
  const [theme, setTheme] = useState('особисте');
  const [filter, setFilter] = useState('усі');
  const [showModal, setShowModal] = useState(false);

  const todayStr = new Date().toDateString();

  // --- Модальне вікно при вході в календар
  useEffect(() => {
    if (!sessionStorage.getItem('calendarVisited')) {
      setShowModal(true);
      sessionStorage.setItem('calendarVisited', 'true');
    }
  }, []);

  // --- Ініціалізація
  useEffect(() => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('calendarEvents')) || {};
      const storedTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
      setEvents(storedEvents);
      setTasks(storedTasks);
    } catch (err) {
      console.error('Помилка зчитування з localStorage:', err);
    }
  }, []);

  // --- Збереження
  const saveEvents = (updated) => {
    setEvents(updated);
    localStorage.setItem('calendarEvents', JSON.stringify(updated));
  };

  const saveTasks = (updated) => {
    setTasks(updated);
    localStorage.setItem('calendarTasks', JSON.stringify(updated));
  };

  // --- Переносимо незавершені задачі з вчора
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toDateString();
    const uncompleted = (tasks[yKey] || []).filter(t => !t.done);
    if (uncompleted.length > 0) {
      const updated = {
        ...tasks,
        [todayStr]: [...(tasks[todayStr] || []), ...uncompleted],
      };
      delete updated[yKey];
      saveTasks(updated);
    }
  }, []);

  // --- Додавання
  const addEvent = () => {
    if (!newEvent.trim()) return;
    const key = selectedDate.toDateString();
    const updated = {
      ...events,
      [key]: [...(events[key] || []), { text: newEvent.trim(), theme }],
    };
    saveEvents(updated);
    setNewEvent('');
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const key = selectedDate.toDateString();
    const updated = {
      ...tasks,
      [key]: [...(tasks[key] || []), { text: newTask.trim(), done: false }],
    };
    saveTasks(updated);
    setNewTask('');
  };

  // --- Редагування
  const handleEditChange = (e, date, i, type) => {
    const val = e.target.value;
    if (type === 'event') {
      const updated = { ...events };
      updated[date][i].text = val;
      saveEvents(updated);
    } else {
      const updated = { ...tasks };
      updated[date][i].text = val;
      saveTasks(updated);
    }
  };

  // --- Видалення
  const deleteEvent = (date, i) => {
    const updated = { ...events };
    updated[date].splice(i, 1);
    if (!updated[date].length) delete updated[date];
    saveEvents(updated);
  };

  const deleteTask = (date, i) => {
    const updated = { ...tasks };
    updated[date].splice(i, 1);
    if (!updated[date].length) delete updated[date];
    saveTasks(updated);
  };

  const toggleTask = (date, i) => {
    const updated = { ...tasks };
    updated[date][i].done = !updated[date][i].done;
    saveTasks(updated);
  };

  // --- Відображення у календарі
  const tileContent = ({ date, view }) => {
    const key = date.toDateString();
    if (view === 'month') {
      const evs = events[key] || [];
      const tds = (tasks[key] || []).filter(t => !t.done);
      const all = [...evs.map(e => ({ theme: e.theme })), ...tds.map(() => ({ theme: 'особисте' }))];
      if (all.length > 0) {
        return (
          <div className="event-dots">
            {all.map((item, i) => (
              <span key={i} className={`dot ${item.theme}`} />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    return date.toDateString() === todayStr ? 'calendar-today' : '';
  };

  const allEvents = Object.entries(events).flatMap(([date, evs]) =>
    evs.map(ev => ({ ...ev, date }))
  );
  const allTasks = Object.entries(tasks).flatMap(([date, tsks]) =>
    tsks.map(task => ({ ...task, date }))
  );

  const filteredEvents = filter === 'усі' ? allEvents : allEvents.filter(ev => ev.theme === filter);

  return (
    <div className="calendar-wrapper">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-window">
            <h3>🔔 Нагадування</h3>
            <p>Перевір події та завдання на сьогодні, щоб нічого не пропустити!</p>
            <button onClick={() => setShowModal(false)}>Закрити</button>
          </div>
        </div>
      )}

      <h2>📅 Календар подій і завдань</h2>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className="react-calendar large-calendar"
        locale="uk-UA"
      />

      <div className="today-reminder">
        <h4>🔔 Події на сьогодні:</h4>
        <ul>
          {(events[todayStr] || []).map((e, i) => (
            <li key={i}><span className={`badge ${e.theme}`}>{e.text}</span></li>
          ))}
        </ul>
        <h4>✅ Завдання на сьогодні:</h4>
        <ul>
          {(tasks[todayStr] || []).filter(t => !t.done).map((t, i) => (
            <li key={i}><span className="badge особисте">{t.text}</span></li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>📌 Події на {selectedDate.toDateString()}:</h3>
        <ul>
          {(events[selectedDate.toDateString()] || []).map((ev, i) => (
            <li key={i}>
              <input
                value={ev.text}
                className={`badge ${ev.theme}`}
                onChange={(e) => handleEditChange(e, selectedDate.toDateString(), i, 'event')}
              />
              <button onClick={() => deleteEvent(selectedDate.toDateString(), i)}>❌</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          placeholder="Нова подія або дедлайн"
        />
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {themeKeys.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={addEvent}>➕</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>📝 Завдання на {selectedDate.toDateString()}:</h3>
        <ul>
          {(tasks[selectedDate.toDateString()] || []).map((t, i) => (
            <li key={i}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(selectedDate.toDateString(), i)}
              />
              <input
                className="badge особисте"
                style={{ textDecoration: t.done ? 'line-through' : '' }}
                value={t.text}
                onChange={(e) => handleEditChange(e, selectedDate.toDateString(), i, 'task')}
              />
              <button onClick={() => deleteTask(selectedDate.toDateString(), i)}>❌</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Нове завдання"
        />
        <button onClick={addTask}>➕</button>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          <h3>📂 Усі події</h3>
          <label>Фільтр: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="усі">усі</option>
            {themeKeys.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ul style={{ marginTop: '10px' }}>
            {filteredEvents.map((ev, i) => (
              <li key={i}>
                <strong>{ev.date}:</strong> <span className={`badge ${ev.theme}`}>{ev.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h3>🗂 Усі завдання</h3>
          <ul style={{ marginTop: '10px' }}>
            {allTasks.map((task, i) => (
              <li key={i}>
                <strong>{task.date}:</strong>{' '}
                <span className="badge особисте" style={{ textDecoration: task.done ? 'line-through' : '' }}>
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
