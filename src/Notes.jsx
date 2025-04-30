import React, { useState, useEffect } from 'react';
import './Notes.css';

const categoryColors = {
  "робота": "#ffebee",
  "навчання": "#e3f2fd",
  "особисте": "#e8f5e9",
  "натхнення": "#f3e5f5"
};

function Notes() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('особисте');
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  // Зчитування при завантаженні
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(saved);
  }, []);

  // Запис у localStorage вручну після змін
  const saveNotes = (updated) => {
    setNotes(updated);
    localStorage.setItem('notes', JSON.stringify(updated));
  };

  const addOrUpdateNote = () => {
    if (!text.trim()) return;

    const reader = new FileReader();

    const createOrUpdate = (fileUrl = null) => {
      let updated;
      if (editId) {
        updated = notes.map(n =>
          n.id === editId
            ? { ...n, text, category, fileUrl: fileUrl ?? n.fileUrl }
            : n
        );
        setEditId(null);
      } else {
        const newNote = {
          id: Date.now(),
          text: text.trim(),
          category,
          created: new Date().toLocaleString(),
          pinned: false,
          fileUrl
        };
        updated = [newNote, ...notes];
      }

      saveNotes(updated);
      setText('');
      setFile(null);
    };

    if (file) {
      reader.onload = () => createOrUpdate(reader.result);
      reader.readAsDataURL(file);
    } else {
      createOrUpdate();
    }
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

  const startEdit = (note) => {
    setEditId(note.id);
    setText(note.text);
    setCategory(note.category);
    setShowCategorySelect(false);
  };

  const pinnedNotes = notes.filter(note => note.pinned);
  const otherNotes = notes.filter(note => !note.pinned);

  return (
    <div className="notes-wrapper">
      <h2>📝 Нотатки</h2>
      <div className="notes-layout">
        <div className="note-input">
          <div className="note-input-top">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введіть нотатку..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
            <div className="note-input-controls">
              <label className="file-upload big-clip">
                📎
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              </label>

              <div className="category-dropdown">
                <button className="category-btn" onClick={() => setShowCategorySelect(!showCategorySelect)}>
                  {category}
                </button>
                {showCategorySelect && (
                  <div className="category-options">
                    {Object.keys(categoryColors).map(cat => (
                      <div
                        key={cat}
                        className="category-option"
                        onClick={() => {
                          setCategory(cat);
                          setShowCategorySelect(false);
                        }}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="add-btn" onClick={addOrUpdateNote}>✔</button>
            </div>
          </div>
        </div>

        <div className="notes-list">
          {[...pinnedNotes, ...otherNotes].map(note => (
            <div
            key={note.id}
            className={`note ${note.pinned ? 'pinned' : ''} ${note.category}`}
            >
              <div className="note-meta">
                <span className="note-category">{note.category}</span>
                <span className="note-date">{note.created}</span>
              </div>
              {note.fileUrl && (
                <div style={{ marginBottom: '10px' }}>
                  <img src={note.fileUrl} alt="attachment" style={{ maxWidth: '100%' }} />
                </div>
              )}
              <p>{note.text}</p>
              <div className="note-actions">
                <button onClick={() => togglePin(note.id)}>📌</button>
                <button onClick={() => startEdit(note)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteNote(note.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notes;
