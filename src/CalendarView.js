import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('calendarEvents');
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    if (!newEvent.trim()) return;
    const dateKey = selectedDate.toDateString();
    const updated = {
      ...events,
      [dateKey]: [...(events[dateKey] || []), newEvent.trim()]
    };
    setEvents(updated);
    setNewEvent('');
  };

  return (
    <div className="calendar-wrapper">
      <h2>📅 Календар подій</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="react-calendar"
      />
      <div style={{ marginTop: '20px' }}>
        <h3>📌 Події на {selectedDate.toDateString()}:</h3>
        <ul>
          {(events[selectedDate.toDateString()] || []).map((ev, i) => (
            <li key={i}>• {ev}</li>
          ))}
        </ul>
        <input
          type="text"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          placeholder="Нова подія або дедлайн"
        />
        <button onClick={handleAddEvent}>➕ Додати</button>
      </div>
    </div>
  );
}

export default CalendarView;
