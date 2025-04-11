import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendarview.css';

const themeKeys = ['робота', 'навчання', 'особисте', 'інше'];

function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState('');
  const [theme, setTheme] = useState('особисте');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('усі');
  const todayStr = new Date().toDateString();

  useEffect(() => {
    const stored = localStorage.getItem('calendarEvents');
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
  }, [events]);

  const handleAddEvent = () => {
    if (!newEvent.trim()) return;
    const dateKey = selectedDate.toDateString();
    const updated = {
      ...events,
      [dateKey]: [...(events[dateKey] || []), { text: newEvent.trim(), theme }]
    };
    setEvents(updated);
    setNewEvent('');
  };

  const handleDelete = (dateKey, index) => {
    const updated = { ...events };
    updated[dateKey].splice(index, 1);
    if (updated[dateKey].length === 0) delete updated[dateKey];
    setEvents(updated);
  };

  const handleEdit = (index, currentText) => {
    setEditIndex(index);
    setEditText(currentText);
  };

  const handleSaveEdit = (dateKey) => {
    const updated = { ...events };
    updated[dateKey][editIndex].text = editText;
    setEvents(updated);
    setEditIndex(null);
    setEditText('');
  };

  const tileContent = ({ date, view }) => {
    const dateKey = date.toDateString();
    if (view === 'month' && events[dateKey]) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {events[dateKey].map((ev, idx) => (
            <span key={idx} className={`dot ${ev.theme}`} />
          ))}
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    const isToday = date.toDateString() === new Date().toDateString();
    return isToday ? 'calendar-today' : null;
  };

  const todaysEvents = events[todayStr] || [];

  const allEvents = Object.entries(events).flatMap(([date, evList]) =>
    evList.map(ev => ({ ...ev, date }))
  );

  const filteredEvents = filter === 'усі' ? allEvents : allEvents.filter(ev => ev.theme === filter);

  return (
    <div className="calendar-wrapper">
      <h2>📅 Календар подій</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className="react-calendar large-calendar"
      />

      <div className="today-reminder">
        <h4>🔔 Події на сьогодні:</h4>
        {todaysEvents.length > 0 ? (
          <ul>
            {todaysEvents.map((e, i) => (
              <li key={i}>• <span className={`badge ${e.theme}`}>{e.text}</span></li>
            ))}
          </ul>
        ) : <p>Сьогодні подій немає 🎉</p>}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>📌 Події на {selectedDate.toDateString()}:</h3>
        <ul>
          {(events[selectedDate.toDateString()] || []).map((ev, i) => (
            <li key={i}>
              {editIndex === i ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  <button onClick={() => handleSaveEdit(selectedDate.toDateString())}>💾</button>
                </>
              ) : (
                <>
                  <span className={`badge ${ev.theme}`}>{ev.text}</span>
                  <button onClick={() => handleEdit(i, ev.text)}>✏️</button>
                </>
              )}
              <button onClick={() => handleDelete(selectedDate.toDateString(), i)}>❌</button>
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
        <button onClick={handleAddEvent}>➕ Додати</button>
      </div>

      <div style={{ marginTop: '30px' }}>
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
    </div>
  );
}

export default CalendarView;
