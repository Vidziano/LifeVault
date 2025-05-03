import React, { useEffect, useState } from 'react';
import './QuickNotesWidget.css';

function QuickNotesWidget() {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(true); // Додаємо стан згортання

  useEffect(() => {
    const loadFavorites = () => {
      const stored = JSON.parse(localStorage.getItem('notes')) || [];
      const favorites = stored.filter(n => n.favorite).slice(0, 3);
      setNotes(favorites);
    };

    loadFavorites();
    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  return (
    <div className="quick-notes-widget">
      <h4 onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
        🗒️ Швидкі замітки {open ? '▲' : '▼'}
      </h4>

      {open && (
        notes.length === 0 ? (
          <p className="no-notes">Немає обраних нотаток</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="quick-note">
              <p>{note.text}</p>
              <span className="quick-date">{note.created}</span>
            </div>
          ))
        )
      )}
    </div>
  );
}

export default QuickNotesWidget;
