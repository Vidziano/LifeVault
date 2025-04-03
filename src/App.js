import React, { useState, useEffect } from 'react';
import './App.css';

import HabitTracker from './HabitTracker';


const categoryColors = {
  "Особисте": "#ffecec",
  "Навчання": "#e6f0ff",
  "Робота": "#e8ffe6",
  "Натхнення": "#f6e6ff",
  "Усі": "#ffffff"
};

const categories = Object.keys(categoryColors);

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Особисте');
  const [selectedCategory, setSelectedCategory] = useState('Усі');
  const [editNoteId, setEditNoteId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('Особисте');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(stored);

    const theme = localStorage.getItem('theme');
    if (theme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const addNote = () => {
    if (text.trim() === '') return;
    const newNote = {
      id: Date.now(),
      text,
      category,
      createdAt: new Date().toLocaleString()
    };
    setNotes([newNote, ...notes]);
    setText('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEditing = (note) => {
    setEditNoteId(note.id);
    setEditText(note.text);
    setEditCategory(note.category);
  };

  const saveEdit = () => {
    const updatedNotes = notes.map(note =>
      note.id === editNoteId
        ? { ...note, text: editText, category: editCategory }
        : note
    );
    setNotes(updatedNotes);
    setEditNoteId(null);
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'lifevault-notes.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = selectedCategory === 'Усі'
    ? notes
    : notes.filter(n => n.category === selectedCategory);

  return (
    <div className={`layout ${darkMode ? 'dark-mode' : ''}`}>
      <aside className="sidebar">
        <h2 className="sidebar-title">📘 LifeVault</h2>

        <div className="theme-toggle">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Світла тема' : '🌙 Темна тема'}
          </button>
        </div>

        <ul>
          {categories.map(cat => (
            <li
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  backgroundColor: categoryColors[cat],
                  borderRadius: '50%',
                  marginRight: '8px'
                }}
              ></span>
              {cat}
            </li>
          ))}
        </ul>

        <button className="export-btn" onClick={exportNotes}>💾 Експортувати</button>
      </aside>

      <main className="main">
        <div className="note-input">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Нова нотатка..."
          />
          <div className="note-controls">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.filter(c => c !== "Усі").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button onClick={addNote}>➕ Додати</button>
          </div>
        </div>

        <div className="notes-list">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="note"
              style={{ backgroundColor: categoryColors[note.category] || '#fff' }}
            >
              {editNoteId === note.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px' }}
                  />
                  <div className="note-controls" style={{ marginTop: '10px' }}>
                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                      {categories.filter(c => c !== "Усі").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button onClick={saveEdit}>💾 Зберегти</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="note-meta">
                    <span>{note.category}</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <p>{note.text}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button className="delete-btn" onClick={() => deleteNote(note.id)}>❌</button>
                    <button
                      className="edit-btn"
                      style={{
                        backgroundColor: '#4e4eeb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}
                      onClick={() => startEditing(note)}
                    >
                      ✏️ Редагувати
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
<HabitTracker />

