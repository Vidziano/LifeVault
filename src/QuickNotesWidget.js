import React, { useEffect, useState } from 'react';
import './QuickNotesWidget.css';

function QuickNotesWidget() {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadFavorites = () => {
      const stored = JSON.parse(localStorage.getItem('notes')) || [];
      const favorites = stored.filter(n => n.favorite);
      setNotes(favorites);
    };

    loadFavorites();
    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  return (
    <>
      <button className="quick-notes-fab" onClick={() => setOpen(!open)}>
        🗒️
      </button>

      {open && (
        <div className="quick-notes-panel">
          <div className="quick-notes-header">
            <h4>📌 Швидкі нотатки</h4>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {notes.length === 0 ? (
            <p className="no-notes">Немає обраних нотаток</p>
          ) : (
            <div className="quick-notes-list">
{notes.map(note => {
  const categoryClass = note.category
    ? note.category.trim().toLowerCase()
    : '';
  return (
    <div
      key={note.id}
      data-testid={`quick-note-${note.id}`} 
      className={`quick-note ${categoryClass}`}
    >
      {note.text && <p>{note.text}</p>}
      {note.fileUrl && <img src={note.fileUrl} alt="note" />}
      <span className="quick-date">{note.created}</span>
    </div>
  );
})}

            </div>
          )}
        </div>
      )}
    </>
  );
}

export default QuickNotesWidget;
