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

  const getColor = (tag) => {
    const tagColors = {
      'робота': '#a0d3f7',
      'навчання': '#b8f7be',
      'особисте': '#fdc2cb',
      'інше': '#f197ff',
      'завдання': '#ffecb2'
    };
    return tagColors[(tag || '').toLowerCase()] || '#eeeeee';
  };
  

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
              {notes.map(note => (
                <div key={note.id} className="quick-note" style={{ background: getColor(note.tag) }}>
  <p>{note.text}</p>
  {note.image && <img src={note.image} alt="note" />}
  <span className="quick-date">{note.created}</span>
</div>

              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default QuickNotesWidget;
