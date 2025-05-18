import React, { useState, useEffect } from 'react';
import './DreamDetails.css';

function DreamDetails({ dream, onBack, onUpdate }) {
  const [steps, setSteps] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [reflection1, setReflection1] = useState('');
  const [reflection2, setReflection2] = useState('');
  const [reflection3, setReflection3] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (dream?.id) {
      const savedReflections = JSON.parse(localStorage.getItem(`reflections-${dream.id}`));
      const savedSteps = JSON.parse(localStorage.getItem(`dream-steps-${dream.id}`));

      if (savedReflections) {
        setReflection1(savedReflections.q1 || '');
        setReflection2(savedReflections.q2 || '');
        setReflection3(savedReflections.q3 || '');
      }

      const initialSteps = (dream.steps || []).map((s) =>
        typeof s === 'string' ? { text: s, done: false } : s
      );

      if (savedSteps && Array.isArray(savedSteps)) {
        // мержимо: беремо текст і done зі збережених, але тільки якщо текст співпадає
        const merged = initialSteps.map((step) => {
          const saved = savedSteps.find(s => s.text === step.text);
          return saved ? { ...step, done: saved.done } : step;
        });
        setSteps(merged);
      } else {
        setSteps(initialSteps);
      }

      const img = localStorage.getItem(`dream-image-${dream.id}`);
      if (img) setImageSrc(img);
    }
  }, [dream]);

  useEffect(() => {
    const doneCount = steps.filter(s => s.done).length;
    const newProgress = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0;
    setProgress(newProgress);

    if (dream?.id && typeof onUpdate === 'function') {
      const updatedDream = { ...dream, steps, progress: newProgress };
      onUpdate(updatedDream);
      localStorage.setItem(`dream-steps-${dream.id}`, JSON.stringify(steps));
    }
  }, [steps, dream, onUpdate]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && dream?.id) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        localStorage.setItem(`dream-image-${dream.id}`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleStep = (index) => {
    const updated = [...steps];
    updated[index].done = !updated[index].done;
    setSteps(updated);
  };

  const handleSave = () => {
    if (dream?.id) {
      localStorage.setItem(`reflections-${dream.id}`, JSON.stringify({
        q1: reflection1,
        q2: reflection2,
        q3: reflection3
      }));
      setSaveMessage('✅ Збережено!');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  const handleClear = () => {
    setReflection1('');
    setReflection2('');
    setReflection3('');
    if (dream?.id) {
      localStorage.removeItem(`reflections-${dream.id}`);
    }
  };

  return (
    <div className="dream-details">
      <div className="dream-header-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="back-button" onClick={onBack}>‹</button>
        <h2 className="dream-title" style={{ flex: 1, textAlign: 'center', margin: 0 }}>{dream.title}</h2>
        <div style={{ width: '40px' }} />
      </div>

      <p><strong>Сфера:</strong> {dream.sphere}</p>
      <p><strong>План:</strong> {dream.plan || '—'}</p>

      {imageSrc && (
        <div style={{ marginBottom: '20px' }}>
          <img src={imageSrc} alt="dream" style={{ maxWidth: '100%', borderRadius: '12px' }} />
        </div>
      )}

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
        <p><strong>Прогрес:</strong> {progress}%</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="dream-section">
        <h4>📖 Історія мрії</h4>
        <p><strong>Чому це важливо:</strong> {dream.why || dream.reason || '—'}</p>
        <p><strong>Я себе бачу так:</strong> {dream.future || dream.futureVision || '—'}</p>
        <p><strong>Історія:</strong> {dream.story || '—'}</p>
      </div>

      <div className="dream-section">
        <h4>🧠 Рефлексія (після досягнення)</h4>
        <p><strong>Як ти це зробила?</strong></p>
        <textarea
          rows={2}
          value={reflection1}
          onChange={(e) => setReflection1(e.target.value)}
        />
        <p><strong>Що допомогло?</strong></p>
        <textarea
          rows={2}
          value={reflection2}
          onChange={(e) => setReflection2(e.target.value)}
        />
        <p><strong>Що сказала б собі в минулому?</strong></p>
        <textarea
          rows={2}
          value={reflection3}
          onChange={(e) => setReflection3(e.target.value)}
        />

        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button onClick={handleSave}>💾 Зберегти</button>
          <button onClick={handleClear}>🗑 Очистити</button>
          {saveMessage && <span style={{ color: 'green', fontWeight: 'bold' }}>{saveMessage}</span>}
        </div>
      </div>
    </div>
  );
}

export default DreamDetails;
