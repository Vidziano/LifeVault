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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(saved);
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const addOrUpdateNote = () => {
    if (!text.trim()) return;
    const reader = new FileReader();
    const createOrUpdate = (fileUrl = null) => {
      if (editId) {
        const updated = notes.map(n =>
          n.id === editId ? { ...n, text, category, fileUrl } : n
        );
        setNotes(updated);
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
        setNotes([newNote, ...notes]);
      }
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
    setNotes(notes.filter(n => n.id !== id));
  };

  const togglePin = (id) => {
    setNotes(prev => {
      return [...prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)]
        .sort((a, b) => b.pinned - a.pinned);
    });
  };

  const startEdit = (note) => {
    setEditId(note.id);
    setText(note.text);
    setCategory(note.category);
  };

  const pinnedNotes = notes.filter(note => note.pinned);
  const otherNotes = notes.filter(note => !note.pinned);

  return (
    <div className="notes-wrapper">
      <h2>📝 Нотатки</h2>
      <div className="note-input">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введіть нотатку..."
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {Object.keys(categoryColors).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={addOrUpdateNote}>{editId ? '💾 Зберегти' : '➕ Додати'}</button>
      </div>

      <div className="notes-list">
        {[...pinnedNotes, ...otherNotes].map(note => (
          <div
            key={note.id}
            className={`note ${note.pinned ? 'pinned' : ''}`}
            style={{ backgroundColor: categoryColors[note.category] || '#fff' }}
            data-category={note.category}
          >
            <div className="note-header">
              <span className="note-date">{note.created}</span>
              <span className="note-category">{note.category}</span>
            </div>
            {note.fileUrl && (
              <div style={{ marginBottom: '10px' }}>
                <img src={note.fileUrl} alt="attachment" style={{ maxWidth: '100%' }} />
              </div>
            )}
            <p>{note.text}</p>
            <div className="note-actions">
              <button onClick={() => togglePin(note.id)}>
                {note.pinned ? '📌 Відкріпити' : '📌 Закріпити'}
              </button>
              <button onClick={() => startEdit(note)}>✏️ Редагувати</button>
              <button className="delete-btn" onClick={() => deleteNote(note.id)}>🗑️ Видалити</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
