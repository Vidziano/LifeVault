import React from 'react';

function DreamReflections({ dreams }) {
  const reflections = dreams.filter(d => d.completed && d.reflections);

  if (reflections.length === 0) return null;

  return (
    <div className="reflections">
      <h3>🧠 Рефлексії після досягнення</h3>
      <ul>
        {reflections.map(d => (
          <li key={d.id}>
            <strong>{d.title}</strong>: {d.reflections}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DreamReflections;
