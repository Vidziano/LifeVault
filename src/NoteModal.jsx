import React, { useState, useEffect } from 'react';
import './NoteModal.css';

function NoteModal({ isOpen, onClose, onSave, existingNote }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('особисте');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title || '');
      setText(existingNote.text || '');
      setCategory(existingNote.category || 'особисте');
      setFileUrl(existingNote.fileUrl || null);
      setFile(null);
      setFilePreview(null);
    } else {
      setTitle('');
      setText('');
      setCategory('особисте');
      setFile(null);
      setFilePreview(null);
      setFileUrl(null);
    }
  }, [existingNote]);

  const handleSave = () => {
    if (!title.trim() && !text.trim()) return;

    const reader = new FileReader();

    const saveData = (finalUrl = null) => {
      const note = {
        ...existingNote,
        title: title.trim(),
        text: text.trim(),
        category,
        fileUrl: finalUrl ?? null,
        created: existingNote?.created || new Date().toLocaleString(),
        id: existingNote?.id || Date.now(),
        pinned: existingNote?.pinned || false,
        favorite: existingNote?.favorite || false,
      };

      onSave(note);
      onClose();
    };

    if (file) {
      reader.onload = () => saveData(reader.result);
      reader.readAsDataURL(file);
    } else {
      saveData(fileUrl);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFilePreview(null);
    setFileUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div className="note-modal-overlay" onClick={onClose}>
      <div className="note-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{existingNote ? 'Редагувати нотатку' : 'Нова нотатка'}</h3>

        <input
          type="text"
          placeholder="Назва нотатки"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="note-title-input"
        />

        <textarea
          placeholder="Текст нотатки..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {(filePreview || fileUrl) && (
          <div style={{ marginTop: '10px', position: 'relative' }}>
            <img
              src={filePreview || fileUrl}
              alt="attached"
              style={{ maxWidth: '100%', borderRadius: '10px' }}
            />
            <button
              onClick={handleRemoveImage}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: '#e57373',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              title="Видалити зображення"
            >
              ×
            </button>
          </div>
        )}

        <div className="note-modal-controls">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="особисте">особисте</option>
            <option value="робота">робота</option>
            <option value="навчання">навчання</option>
            <option value="натхнення">натхнення</option>
          </select>
          <label className="file-upload">
            📎
            <input type="file" onChange={handleFileChange} />
          </label>
        </div>

        <div className="note-modal-buttons">
          <button onClick={onClose}>Скасувати</button>
          <button className="save" onClick={handleSave}>Зберегти</button>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
