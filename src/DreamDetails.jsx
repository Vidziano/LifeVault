import React, { useState } from 'react';
import './DreamDetails.css';

function DreamDetails({ dream, onBack }) {
  const [steps, setSteps] = useState(
    (dream.steps || []).map((s) =>
      typeof s === 'string' ? { text: s, done: false } : s
    )
  );

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📷 Завантажено файл:", file.name);
    }
  };

  const toggleStep = (index) => {
    const updated = [...steps];
    updated[index].done = !updated[index].done;
    setSteps(updated);
  };

  return (
    <div className="dream-details">
      <button className="back-button" onClick={onBack}>⬅️ Назад</button>
      <h2 className="dream-title">{dream.title}</h2>
      <p><strong>Сфера:</strong> {dream.sphere}</p>
      <p><strong>План:</strong> {dream.plan || '—'}</p>

      <label className="file-upload">
        📎 Обрати файл
        <input type="file" onChange={handleFile} />
      </label>

      <div className="dream-section">
        <h4>📋 Кроки до мрії</h4>
        <ul className="steps-list">
          {steps.map((s, i) => (
            <li key={i}>
              <input
                type="checkbox"
                checked={s.done}
                onChange={() => toggleStep(i)}
              />{' '}
              {s.text}
            </li>
          ))}
        </ul>
        <p><strong>Прогрес:</strong> {dream.progress || 0}%</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${dream.progress || 0}%` }}></div>
        </div>
      </div>

      <div className="dream-section">
        <h4>📖 Історія мрії</h4>
        <p><strong>Чому це важливо:</strong> {dream.why || '—'}</p>
        <p><strong>Я себе бачу так:</strong> {dream.future || '—'}</p>
        <p><strong>Історія:</strong> {dream.story || '—'}</p>
      </div>

      <div className="dream-section">
        <h4>🧠 Рефлексія (після досягнення)</h4>
        <p><strong>Як ти це зробила?</strong></p>
        <textarea rows={2} />
        <p><strong>Що допомогло?</strong></p>
        <textarea rows={2} />
        <p><strong>Що сказала б собі в минулому?</strong></p>
        <textarea rows={2} />
      </div>
    </div>
  );
}

export default DreamDetails;
