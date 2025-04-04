import React, { useState, useEffect, useRef } from 'react';
import './InspirationBoard.css';

function InspirationBoard() {
  const [items, setItems] = useState([]);
  const [newText, setNewText] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000');
  const [tool, setTool] = useState('pen');
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

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

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    if (tool === 'pen') {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = 2;
    } else if (tool === 'eraser') {
      contextRef.current.strokeStyle = '#fff';
      contextRef.current.lineWidth = 10;
    }
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 300;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = 2;
    contextRef.current = context;
  }, [color]);

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

      <div className="drawing-tools">
        <h4>🖌️ Малювання</h4>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}
        />
        <div style={{ marginTop: '10px' }}>
          <label>Колір: </label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <label style={{ marginLeft: '20px' }}>Інструмент: </label>
          <select value={tool} onChange={(e) => setTool(e.target.value)}>
            <option value="pen">Ручка</option>
            <option value="eraser">Резинка</option>
          </select>
        </div>
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
