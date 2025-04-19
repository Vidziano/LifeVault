import React, { useState, useEffect, useRef } from 'react';
import './InspirationBoard.css';

function InspirationBoard() {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('inspoItems');
    return stored ? JSON.parse(stored) : [];
  });

  const [newText, setNewText] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000');
  const [tool, setTool] = useState('pen');
  const [lineWidth, setLineWidth] = useState(2);
  const [textInput, setTextInput] = useState('');
  const [imageToDraw, setImageToDraw] = useState(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('inspoItems', JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    if (!newText && !newImage) return;

    const addItem = (imgUrl = null) => {
      const updated = [...items, { text: newText, img: imgUrl }];
      setItems(updated);
      setNewText('');
      setNewImage(null);
    };

    if (newImage) {
      const reader = new FileReader();
      reader.onload = () => addItem(reader.result);
      reader.readAsDataURL(newImage);
    } else {
      addItem();
    }
  };

  const handleDelete = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleEditText = (index, newText) => {
    const updated = [...items];
    updated[index].text = newText;
    setItems(updated);
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (tool === 'text' && textInput) {
      contextRef.current.fillStyle = color;
      contextRef.current.font = `${lineWidth * 5}px sans-serif`;
      contextRef.current.fillText(textInput, offsetX, offsetY);
      setTextInput('');
    } else if (tool === 'image' && imageToDraw) {
      const img = new Image();
      img.onload = () => {
        contextRef.current.drawImage(img, offsetX, offsetY, 100, 100);
        setImageToDraw(null);
      };
      img.src = URL.createObjectURL(imageToDraw);
    } else {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || (tool !== 'pen' && tool !== 'eraser')) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.strokeStyle = tool === 'pen' ? color : '#fff';
    contextRef.current.lineWidth = tool === 'pen' ? lineWidth : 10;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const saveCanvasAsItem = () => {
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL('image/png');
    const updated = [...items, { img: imgData }];
    setItems(updated);
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'pen' ? color : '#fff';
      contextRef.current.lineWidth = tool === 'pen' ? lineWidth : 10;
    }
  }, [color, lineWidth, tool]);

  return (
    <div className="inspo-board">
      <h2>🌟 Дошка натхнення</h2>

      <div className="inspo-input-row">
        <textarea
          placeholder="Твоя ідея або цитата... (можна з емодзі 😊)"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows={4}
        ></textarea>

        <div className="inspo-input-actions">
          <label className="big-clip">
            📎
            <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
          </label>
          <button className="add-btn" onClick={handleAdd}>✔</button>
        </div>
      </div>

      <div className="drawing-tools">
        <h4>🎨 Малювання</h4>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ border: '1px solid #ccc', borderRadius: '8px', background: '#fff', width: '100%', height: '500px' }}
          width={1000}
          height={500}
        />
        <div style={{ marginTop: '10px' }}>
          <label>Колір: </label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <label style={{ marginLeft: '20px' }}>Інструмент: </label>
          <select value={tool} onChange={(e) => setTool(e.target.value)}>
            <option value="pen">Ручка</option>
            <option value="eraser">Резинка</option>
            <option value="text">Текст ✍️</option>
            <option value="image">Фото 🖼️</option>
          </select>
          {tool === 'text' && (
            <input
              type="text"
              placeholder="Введи текст або емодзі..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          )}
          {tool === 'image' && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageToDraw(e.target.files[0])}
              style={{ marginLeft: '10px' }}
            />
          )}
          <label style={{ marginLeft: '20px' }}>Товщина: </label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
          <button style={{ marginLeft: '20px' }} onClick={saveCanvasAsItem}>💾 Зберегти малюнок</button>
        </div>
      </div>

      <div className="inspo-grid">
        {items.map((item, i) => (
          <div key={i} className="inspo-card">
            {item.img && <img src={item.img} alt="idea" />}
            {item.text && (
              <textarea
                value={item.text}
                onChange={(e) => handleEditText(i, e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              ></textarea>
            )}
            <button onClick={() => handleDelete(i)}>❌</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InspirationBoard;
