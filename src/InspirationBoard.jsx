import React, { useState, useEffect, useRef } from 'react';
import './InspirationBoard.css';
import html2canvas from 'html2canvas';


function InspirationBoard() {
  const canvasRef = useRef(null);
  const boardRef = useRef(null);

  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  const [startSize, setStartSize] = useState({ width: 0, height: 0, fontSize: 16 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [objects, setObjects] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [clipboardObject, setClipboardObject] = useState(null);

  const [draggingObjectId, setDraggingObjectId] = useState(null);
  const [resizingObjectId, setResizingObjectId] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
  }, []);

  useEffect(() => {
    if (tool === 'pen' || tool === 'eraser') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.strokeStyle = tool === 'pen' ? color : '#ffffff';
      ctx.lineWidth = tool === 'pen' ? lineWidth : 20;
    }
  }, [tool, color, lineWidth]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'c' && selectedObjectId) {
        e.preventDefault();
        const obj = objects.find(o => o.id === selectedObjectId);
        if (obj) setClipboardObject(obj);
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'v' && clipboardObject) {
        e.preventDefault();
        saveHistory();
        const newObj = {
          ...clipboardObject,
          id: Date.now(),
          x: clipboardObject.x + 20,
          y: clipboardObject.y + 20,
        };
        setObjects(prev => [...prev, newObj]);
        setSelectedObjectId(newObj.id);
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObjectId !== null) {
        e.preventDefault();
        saveHistory();
        setObjects(prev => prev.filter(obj => obj.id !== selectedObjectId));
        setSelectedObjectId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [objects, selectedObjectId, clipboardObject, history, redoStack]);

  const saveHistory = () => {
    setHistory(prev => [...prev, objects]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setRedoStack(prev => [objects, ...prev]);
      setHistory(prev => prev.slice(0, -1));
      setObjects(prevState);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory(prev => [...prev, objects]);
      setRedoStack(prev => prev.slice(1));
      setObjects(nextState);
    }
  };

  const startDrawing = (e) => {
    if (tool !== 'pen' && tool !== 'eraser') return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleBoardClick = (e) => {
    if (tool === 'text') {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      saveHistory();
      const newText = {
        id: Date.now(),
        type: 'text',
        x,
        y,
        width: 150,
        height: 50,
        value: '',
        color,
        fontSize: fontSize,
      };
      setObjects(prev => [...prev, newText]);
      setSelectedObjectId(newText.id);
    } else if (tool === 'image' && imageFile) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      saveHistory();
      const newImage = {
        id: Date.now(),
        type: 'image',
        x,
        y,
        width: 150,
        height: 150,
        src: URL.createObjectURL(imageFile),
      };
      setObjects(prev => [...prev, newImage]);
      setImageFile(null);
      setTool('move');
    }
  };

  const handleTextChange = (e, id) => {
    setObjects(prev =>
      prev.map(obj => obj.id === id ? { ...obj, value: e.target.value } : obj)
    );
  };
  const handleFontSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setFontSize(newSize);
  
    if (selectedObjectId !== null) {
      setObjects(prev =>
        prev.map(obj =>
          obj.id === selectedObjectId && obj.type === 'text'
            ? { ...obj, fontSize: newSize }
            : obj
        )
      );
    }
  };
  
  const startDragging = (e, id) => {
    if (e.target.className === 'resize-handle') return;
    setDraggingObjectId(id);
    setStartPos({ x: e.clientX, y: e.clientY });
    setSelectedObjectId(id);
  };

  const startResizing = (e, id) => {
    const obj = objects.find(o => o.id === id);
    if (!obj) return;
  
    setResizingObjectId(id);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: obj.width, height: obj.height, fontSize: obj.fontSize || 16 });
    setSelectedObjectId(id);
  };
  

  const handleMouseMove = (e) => {
    if (draggingObjectId) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setStartPos({ x: e.clientX, y: e.clientY });
      setObjects(prev =>
        prev.map(obj => obj.id === draggingObjectId ? { ...obj, x: obj.x + dx, y: obj.y + dy } : obj)
      );
    } else if (resizingObjectId) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setStartPos({ x: e.clientX, y: e.clientY });
  
      setObjects(prev => {
        const updated = [...prev];
        const index = updated.findIndex(obj => obj.id === resizingObjectId);
        if (index !== -1) {
          const obj = updated[index];
  
          const newWidth = Math.max(30, obj.width + dx);
          const newHeight = Math.max(30, obj.height + dy);
  
          let newFontSize = obj.fontSize;
          if (obj.type === 'text' && startSize.width) {
            const scale = newWidth / startSize.width;
            newFontSize = Math.max(8, Math.min(72, startSize.fontSize * scale));
          }
  
          updated[index] = {
            ...obj,
            width: newWidth,
            height: newHeight,
            ...(obj.type === 'text' ? { fontSize: newFontSize } : {}),
          };
        }
        return updated;
      });
    }
  };
    

  const handleMouseUp = () => {
    setDraggingObjectId(null);
    setResizingObjectId(null);
    stopDrawing();
  };

  const handleSaveCanvas = async () => {
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL('image/png');
    const timestamp = new Date().toLocaleString();
    
    const savedState = {
      canvasImage: imgData,     // малюнок ручкою
      objects: [...objects],    // тексти + фото
      timestamp,
    };
  
    setSavedItems(prev => [...prev, savedState]);
  };
  
  

  const handleDownload = (imgData) => {
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'saved-image.png';
    link.click();
  };

  const handleClearBoard = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setObjects([]);
    setSelectedObjectId(null);
    setHistory([]);
    setRedoStack([]);
  };
  

  const handleEdit = (savedState) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    // Очистити попередній малюнок
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Намалювати збережений малюнок ручкою
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = savedState.canvasImage;
  
    // Відновити об'єкти
    setObjects(savedState.objects || []);
    setSelectedObjectId(null);
  };
  

  return (
    <div className="inspo-board">
      <h2>🌟 Дошка натхнення</h2>

      <div className="toolbar">
        <button onClick={() => setTool('select')}>🖱️ Виділити</button>
        <button onClick={() => setTool('pen')}>✏️ Малювання</button>
        <button onClick={() => setTool('eraser')}>🧽 Ластик</button>
        <button onClick={() => setTool('text')}>✍️ Текст</button>
        <button onClick={handleClearBoard}>🧹 Очистити дошку</button>
        <label className="file-btn">
          🖼️ Фото
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
              setTool('image');
            }}
          />
        </label>
        <button onClick={handleSaveCanvas}>💾 Зберегти дошку</button>
      </div>
      <div className="color-thickness-controls" style={{ marginTop: '10px' }}>
  <label>
    🎨 Колір:
    <input
      type="color"
      value={color}
      onChange={(e) => setColor(e.target.value)}
      style={{ marginLeft: '10px' }}
    />
  </label>

  <input type="range" min="8" max="72" value={fontSize} onChange={handleFontSizeChange} />

  <label style={{ marginLeft: '20px' }}>
    📏 Товщина:
    <input
      type="range"
      min="1"
      max="20"
      value={lineWidth}
      onChange={(e) => setLineWidth(Number(e.target.value))}
      style={{ marginLeft: '10px' }}
    />
  </label>
</div>
      <div
        ref={boardRef}
        className="board-area"
        onClick={handleBoardClick}
        onMouseDown={startDrawing}
        onMouseMove={(e) => {
          draw(e);
          handleMouseMove(e);
        }}
        onMouseUp={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          style={{ background: '#fff', border: '2px solid #ccc' }}
        />

{objects.map(obj => (
  obj.type === 'text' ? (
    <textarea
      key={obj.id}
      style={{
        position: 'absolute',
        left: obj.x,
        top: obj.y,
        width: obj.width,
        height: obj.height,
        resize: 'both',
        fontSize: `${obj.fontSize || 16}px`, 
        color: obj.color,
        background: 'transparent',
        border: obj.id === selectedObjectId ? '2px solid blue' : 'none',
      }}
      onMouseDown={(e) => startDragging(e, obj.id)}
      onClick={(e) => e.stopPropagation()}
    />
  ) : (
    <div
      key={obj.id}
      style={{
        position: 'absolute',
        left: obj.x,
        top: obj.y,
        width: obj.width,
        height: obj.height,
        border: obj.id === selectedObjectId ? '2px solid blue' : 'none',
        background: 'transparent'
      }}
      onMouseDown={(e) => startDragging(e, obj.id)}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={obj.src}
        alt="uploaded"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
      {obj.id === selectedObjectId && (
        <div
          className="resize-handle"
          onMouseDown={(e) => startResizing(e, obj.id)}
        />
      )}
    </div>
  )
))}

      </div>

      {/* Галерея збережених малюнків */}
      <div className="saved-gallery">
  {savedItems.map((item, index) => (
    <div key={index} className="saved-card">
      <img
        src={item.canvasImage} 
        alt={`saved-${index}`} 
        className="saved-image"
        style={{
          width: '200px',
          height: 'auto',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          marginBottom: '8px',
        }}
      />
      <p className="timestamp" style={{ fontSize: '14px', color: '#555' }}>{item.timestamp}</p>
      <div className="saved-buttons">
        <button onClick={() => handleEdit(item)}>✏️ Редагувати</button>
        <button onClick={() => handleDownload(item.img)}>⬇️ Завантажити</button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default InspirationBoard;
