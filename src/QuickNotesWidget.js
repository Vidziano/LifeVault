import React, { useEffect, useState } from 'react';
import './QuickNotesWidget.css';

function QuickNotesWidget() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('notes')) || [];
    const pinned = stored.filter(n => n.pinned).slice(0, 3); // Показати до 3-х закріплених
    setNotes(pinned);
  }, []);

  return (
    <div className="quick-notes-widget">
      <h4>🗒️ Швидкі замітки</h4>
      {notes.length === 0 ? (
        <p className="no-notes">Немає закріплених нотаток</p>
      ) : (
        notes.map(note => (
          <div key={note.id} className="quick-note">
            <p>{note.text}</p>
            <span className="quick-date">{note.created}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default QuickNotesWidget;
