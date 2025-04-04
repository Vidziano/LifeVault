import React, { useState, useEffect } from 'react';
import './InspirationBoard.css';

function InspirationBoard() {
  const [items, setItems] = useState([]);
  const [newText, setNewText] = useState('');
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('inspoItems')) || [];
    setItems(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('inspoItems', JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    if (!newText && !newImage) return;
    const reader = new FileReader();
    if (newImage) {
      reader.onload = () => {
        setItems([...items, { text: newText, img: reader.result }]);
        setNewText('');
        setNewImage(null);
      };
      reader.readAsDataURL(newImage);
    } else {
      setItems([...items, { text: newText }]);
      setNewText('');
    }
  };

  const handleDelete = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  return (
    <div className="inspo-board">
      <h2>🌟 Дошка натхнення</h2>

      <div className="inspo-input">
        <textarea
          placeholder="Твоя ідея або цитата..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        ></textarea>
        <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
        <button onClick={handleAdd}>➕ Додати</button>
      </div>

      <div className="inspo-grid">
        {items.map((item, i) => (
          <div key={i} className="inspo-card">
            {item.img && <img src={item.img} alt="idea" />}
            {item.text && <p>{item.text}</p>}
            <button onClick={() => handleDelete(i)}>❌</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InspirationBoard;
