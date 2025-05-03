import React, { useState, useEffect } from 'react';
import './Dreams.css';
import DreamChart from './DreamChart';
import DreamReflections from './DreamReflections';
import DreamDetails from './DreamDetails';

const spheres = ['здоров’я', 'кар’єра', 'особисте', 'соціальне'];

function Dreams() {
  const [dreams, setDreams] = useState([]);
  const [newDream, setNewDream] = useState({
    title: '',
    sphere: 'особисте',
    plan: '',
    steps: [''],
    story: '',
    futureVision: '',
    reason: ''
  });
  const [selectedDream, setSelectedDream] = useState(null);
  const [stepWarning, setStepWarning] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dreams')) || [];
    setDreams(stored);
  }, []);

  useEffect(() => {
    if (dreams.length > 0) {
      localStorage.setItem('dreams', JSON.stringify(dreams));
    }
  }, [dreams]);

  const addDream = () => {
    const filteredSteps = newDream.steps.filter(s => s.trim() !== '');
    if (!newDream.title.trim() || filteredSteps.length === 0) {
      setStepWarning(true);
      return;
    }
    const dream = {
      ...newDream,
      steps: filteredSteps,
      id: Date.now(),
      completed: false,
      reflections: null,
      image: null
    };
    const updated = [dream, ...dreams];
    setDreams(updated);
    localStorage.setItem('dreams', JSON.stringify(updated));
    setNewDream({
      title: '', sphere: 'особисте', plan: '', steps: [''],
      story: '', futureVision: '', reason: ''
    });
    setStepWarning(false);
  };

  const updateStep = (index, value) => {
    const steps = [...newDream.steps];
    steps[index] = value;
    setNewDream({ ...newDream, steps });
  };

  const addStepField = () => {
    setNewDream({ ...newDream, steps: [...newDream.steps, ''] });
  };

  const toggleComplete = (id) => {
    const updated = dreams.map(d => {
      if (d.id === id && !d.completed) {
        return { ...d, completed: true };
      }
      return d;
    });
    setDreams(updated);
    localStorage.setItem('dreams', JSON.stringify(updated));
  };

  const handleBack = () => setSelectedDream(null);

  const handleUpdateDream = (updatedDream) => {
    const updated = dreams.map(d => d.id === updatedDream.id ? updatedDream : d);
    setDreams(updated);
    localStorage.setItem('dreams', JSON.stringify(updated));
  };

  const getProgress = (dream) => {
    const steps = Array.isArray(dream.steps)
      ? dream.steps.map(s => (typeof s === 'string' ? { text: s, done: false } : s))
      : [];
    const done = steps.filter(s => s.done).length;
    return steps.length > 0 ? Math.round((done / steps.length) * 100) : 0;
  };

  return (
    <div className="dreams">
      {selectedDream ? (
        <DreamDetails
          dream={selectedDream}
          onBack={handleBack}
          onUpdate={handleUpdateDream}
        />
      ) : (
        <>
          <h2>🌈 Мрії</h2>

          <div className="dream-form">
            <input
              type="text"
              placeholder="Назва мрії"
              value={newDream.title}
              onChange={(e) => setNewDream({ ...newDream, title: e.target.value })}
            />

            <select
              value={newDream.sphere}
              onChange={(e) => setNewDream({ ...newDream, sphere: e.target.value })}
            >
              {spheres.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <textarea
              placeholder="План дій"
              value={newDream.plan}
              onChange={(e) => setNewDream({ ...newDream, plan: e.target.value })}
            />

            <div className="steps-block">
              {newDream.steps.map((step, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Крок ${i + 1}`}
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                />
              ))}
              <button onClick={addStepField}>➕ Ще крок</button>
              {stepWarning && (
                <p style={{ color: 'red', fontSize: '12px' }}>
                  ⚠️ Додай хоча б один крок до мрії
                </p>
              )}
            </div>

            <textarea
              placeholder="Чому ця мрія важлива?"
              value={newDream.reason}
              onChange={(e) => setNewDream({ ...newDream, reason: e.target.value })}
            />
            <textarea
              placeholder="Якою я себе бачу?"
              value={newDream.futureVision}
              onChange={(e) => setNewDream({ ...newDream, futureVision: e.target.value })}
            />
            <textarea
              placeholder="Історія мрії"
              value={newDream.story}
              onChange={(e) => setNewDream({ ...newDream, story: e.target.value })}
            />

            <button onClick={addDream}>💫 Додати мрію</button>
          </div>

          <DreamChart dreams={dreams} />

          <h3>📋 Мої мрії ({dreams.length})</h3>

          <ul className="dream-list">
            {dreams.map(d => (
              <li key={d.id} className={d.completed ? 'completed' : ''}>
                <strong>{d.title || '[без назви]'}</strong> — {d.sphere} — {getProgress(d)}%
                <button onClick={() => setSelectedDream(d)}>🔍 Переглянути</button>
                {!d.completed && <button onClick={() => toggleComplete(d.id)}>✅ Здійснено</button>}
              </li>
            ))}
          </ul>

          <DreamReflections dreams={dreams} />
        </>
      )}
    </div>
  );
}

export default Dreams;
