import React, { useState, useEffect } from 'react';
import './Dreams.css';

function DreamDetails({ dream, onBack, onUpdate }) {
  const [steps, setSteps] = useState(
    dream.steps.map((s, i) => ({ text: typeof s === 'string' ? s : s.text, done: s.done || false }))
  );
  const [image, setImage] = useState(dream.image || null);
  const [reflections, setReflections] = useState(dream.reflections || {
    how: '', help: '', pastMessage: ''
  });

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('dream_progress_' + dream.id));
    if (storedProgress) {
      setSteps(storedProgress.steps || steps);
      setImage(storedProgress.image || image);
      setReflections(storedProgress.reflections || reflections);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'dream_progress_' + dream.id,
      JSON.stringify({ steps, image, reflections })
    );

    const updatedDream = {
      ...dream,
      steps,
      image,
      reflections
    };
    onUpdate(updatedDream);
  }, [steps, image, reflections]);

  const toggleStep = (index) => {
    const updated = [...steps];
    updated[index].done = !updated[index].done;
    setSteps(updated);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleReflectionChange = (field, value) => {
    setReflections(prev => ({ ...prev, [field]: value }));
  };

  const progressPercent = Math.round((steps.filter(s => s.done).length / steps.length) * 100);

  return (
    <div className="dream-details">
      <button onClick={onBack}>⬅️ Назад</button>

      <h2>{dream.title}</h2>
      <p><strong>Сфера:</strong> {dream.sphere}</p>
      <p><strong>План:</strong> {dream.plan}</p>

      {image && <img src={image} alt="dream" className="dream-image" />}<br />
      <label>
        📸 Додати фото:
        <input type="file" onChange={handleImageUpload} />
      </label>

      <h3>📋 Кроки до мрії</h3>
      <ul className="steps-list">
        {steps.map((s, i) => (
          <li key={i}>
            <input
              type="checkbox"
              checked={s.done}
              onChange={() => toggleStep(i)}
            /> {s.text}
          </li>
        ))}
      </ul>

      <p><strong>Прогрес:</strong> {progressPercent}%</p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <h3>📖 Історія мрії</h3>
      <p><strong>Чому важлива:</strong> {dream.reason}</p>
      <p><strong>Я себе бачу так:</strong> {dream.futureVision}</p>
      <p><strong>Історія:</strong> {dream.story}</p>

      <h3>🧠 Рефлексія (після досягнення)</h3>
      <textarea
        placeholder="Як ти це зробила?"
        value={reflections.how}
        onChange={(e) => handleReflectionChange('how', e.target.value)}
      />
      <textarea
        placeholder="Що допомогло?"
        value={reflections.help}
        onChange={(e) => handleReflectionChange('help', e.target.value)}
      />
      <textarea
        placeholder="Що сказала б собі в минулому?"
        value={reflections.pastMessage}
        onChange={(e) => handleReflectionChange('pastMessage', e.target.value)}
      />
    </div>
  );
}

export default DreamDetails;