import React, { useState, useEffect } from 'react';
import './Notes.css';
import NoteModal from './NoteModal';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(saved);
  }, []);

  const saveNotes = (updated) => {
    setNotes(updated);
    localStorage.setItem('notes', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveNote = (note) => {
    const updated = notes.some(n => n.id === note.id)
      ? notes.map(n => n.id === note.id ? note : n)
      : [note, ...notes];
    saveNotes(updated);
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
  };

  const togglePin = (id) => {
    const updated = [...notes.map(n =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    )].sort((a, b) => b.pinned - a.pinned);
    saveNotes(updated);
  };

  const toggleFavorite = (id) => {
    const updated = notes.map(n =>
      n.id === id ? { ...n, favorite: !n.favorite } : n
    );
    saveNotes(updated);
  };

  const startEdit = (note) => {
    setNoteToEdit(note);
    setShowModal(true);
  };

  const pinnedNotes = notes.filter(note => note.pinned);
  const otherNotes = notes.filter(note => !note.pinned);

  return (
    <div className="notes-wrapper">
      <div className="notes-header">
        <h2>📝 Нотатки</h2>
        <button className="add-btn" onClick={() => { setNoteToEdit(null); setShowModal(true); }}>
          ➕ Додати нотатку
       </button>
      </div>


      <div className="notes-list">
        {[...pinnedNotes, ...otherNotes].map(note => (
          <div key={note.id} className={`note ${note.pinned ? 'pinned' : ''} ${note.category}`}>
          <div className="note-meta">
            <span className="note-category">{note.category}</span>
            <span className="note-date">{note.created}</span>
          </div>
        
          <h4 className="note-title">{note.title}</h4>

          <div className="note-content">
            {note.fileUrl && (
              <div className="note-image">
                <img src={note.fileUrl} alt="attachment" />
              </div>
            )}
            <div className="note-text-scrollable">
              <p>{note.text}</p>
            </div>
          </div>
        
          <div className="note-actions">
            <button onClick={() => toggleFavorite(note.id)}>{note.favorite ? '⭐' : '☆'}</button>
            <button onClick={() => togglePin(note.id)}>📌</button>
            <button onClick={() => startEdit(note)}>✏️</button>
            <button className="delete-btn" onClick={() => deleteNote(note.id)}>🗑️</button>
          </div>
        </div>
        ))}
      </div>

      <NoteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveNote}
        existingNote={noteToEdit}
      />
    </div>
  );
}

export default Notes;
