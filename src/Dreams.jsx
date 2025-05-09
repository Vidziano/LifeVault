import React, { useState, useEffect, useRef } from 'react';
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
  const [editingId, setEditingId] = useState(null);
  const [selectedDream, setSelectedDream] = useState(null);
  const [stepWarning, setStepWarning] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dreams'));
    if (stored && Array.isArray(stored)) {
      setDreams(stored);
    }
  }, []);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current?.scrollIntoView?.();
    }
  };

  const addOrUpdateDream = () => {
    const filteredSteps = newDream.steps.filter(s => s.trim() !== '');
    if (!newDream.title.trim() || filteredSteps.length === 0) {
      setStepWarning(true);
      return;
    }

    const updatedDream = {
      ...newDream,
      steps: filteredSteps,
      id: editingId || Date.now(),
      completed: dreams.find(d => d.id === editingId)?.completed || false,
      reflections: dreams.find(d => d.id === editingId)?.reflections || null,
      image: dreams.find(d => d.id === editingId)?.image || null
    };

    const updated = editingId
      ? dreams.map(d => d.id === editingId ? updatedDream : d)
      : [updatedDream, ...dreams];

    setDreams(updated);
    localStorage.setItem('dreams', JSON.stringify(updated));
    setNewDream({
      title: '',
      sphere: 'особисте',
      plan: '',
      steps: [''],
      story: '',
      futureVision: '',
      reason: ''
    });
    setEditingId(null);
    setStepWarning(false);
  };

  const editDream = (dream) => {
    setNewDream({ ...dream });
    setEditingId(dream.id);
    scrollToForm();
  };

  const deleteDream = (id) => {
    const updated = dreams.filter(d => d.id !== id);
    setDreams(updated);
    localStorage.setItem('dreams', JSON.stringify(updated));
    setSelectedDream(null);
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
    const updated = dreams.map(d =>
      d.id === id ? { ...d, completed: !d.completed } : d
    );
    setDreams(updated);
    localStorage.setItem('dreams', JSON.stringify(updated));
  };

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
          onBack={() => setSelectedDream(null)}
          onUpdate={handleUpdateDream}
          onDelete={deleteDream}
        />
      ) : (
        <>
          <h2>🌈 Мрії</h2>

          <div className="dream-form" ref={formRef}>
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
              {stepWarning && <p className="field-error">⚠️ Додай хоча б один крок</p>}
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
            <button onClick={addOrUpdateDream}>
              {editingId ? '✏️ Зберегти зміни' : '💫 Додати мрію'}
            </button>
          </div>

          <DreamChart dreams={dreams} />
          <h3>📋 Мої мрії ({dreams.length})</h3>

          <ul className="dream-list">
            {dreams.map(d => (
              <li key={d.id} className={d.completed ? 'completed' : ''}>
                <div className="dream-header">
                  <input
                    type="checkbox"
                    checked={d.completed}
                    onChange={() => toggleComplete(d.id)}
                    style={{ marginRight: '8px' }}
                  />
                  <strong>{d.title || '[без назви]'}</strong> — {d.sphere} — {getProgress(d)}%
                </div>
                <div className="dream-buttons">
                  <button onClick={() => setSelectedDream(d)}>🔍</button>
                  <button onClick={() => editDream(d)}>✏️</button>
                  <button onClick={() => deleteDream(d.id)} className="delete-btn">🗑️</button>
                </div>
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