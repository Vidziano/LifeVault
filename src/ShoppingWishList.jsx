import React, { useState, useEffect } from 'react';
import './ShoppingWishList.css';

function ShoppingWishList() {
  const [savedItems, setSavedItems] = useState(() => {
    const data = localStorage.getItem('shoppingList');
    return data ? JSON.parse(data) : [];
  });

  const [formData, setFormData] = useState({
    title: '',
    link: '',
    imageFile: null,
    imageUrl: '',
    imageData: '',
    price: ''
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        imageData: reader.result,
        imageFile: file
      }));
    };
    reader.readAsDataURL(file);
  };

  const addOrUpdateItem = () => {
    if (!formData.title.trim()) return;

    const newItem = {
      id: editingId ?? Date.now(),
      title: formData.title,
      link: formData.link,
      price: formData.price,
      imageUrl: formData.imageUrl,
      imageData: formData.imageData
    };

    const updatedItems = editingId
      ? savedItems.map(item => (item.id === editingId ? newItem : item))
      : [newItem, ...savedItems];

    setSavedItems(updatedItems);
    setFormData({ title: '', link: '', imageFile: null, imageUrl: '', imageData: '', price: '' });
    setEditingId(null);
  };

  const removeItem = (id) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const startEdit = (item) => {
    setFormData({
      title: item.title,
      link: item.link,
      price: item.price,
      imageUrl: item.imageUrl,
      imageData: item.imageData,
      imageFile: null
    });
    setEditingId(item.id);
  };

  const exportList = () => {
    const dataStr = JSON.stringify(savedItems, null, 2);
    navigator.clipboard.writeText(dataStr);
    alert('JSON скопійовано! Надішли друзям цей текст.');
  };

  const importList = () => {
    const input = prompt('Встав сюди JSON вішлісту:');
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      setSavedItems(parsed);
    } catch (e) {
      alert('Помилка! JSON некоректний.');
    }
  };

  return (
    <div className="shopping-wishlist">
      <h2>🛍️ Список покупок</h2>

      <div className="shopping-inputs">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Назва товару"
        />

        <input
          type="text"
          value={formData.link}
          onChange={(e) => handleChange('link', e.target.value)}
          placeholder="Посилання на товар"
        />

        <input
          type="text"
          value={formData.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="Посилання на зображення (або вибери файл)"
        />

        <input
          type="file"
          onChange={handleFileChange}
        />

        <input
          type="text"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          placeholder="Ціна"
        />

        <button onClick={addOrUpdateItem}>
          {editingId ? '💾 Зберегти' : '➕ Додати'}
        </button>
        <button onClick={exportList}>📤 Поділитись</button>
        <button onClick={importList}>📥 Імпорт</button>
      </div>

      <div className="shopping-list">
        {savedItems.map(item => (
          <div key={item.id} className="shopping-card">
            <button className="delete-button" onClick={() => removeItem(item.id)}>🗑️</button>
            <button className="edit-button" onClick={() => startEdit(item)}>✏️</button>
            {item.imageData && <img src={item.imageData} alt={item.title} />}
            {!item.imageData && item.imageUrl && <img src={item.imageUrl} alt={item.title} />}
            <div className="shopping-info">
              <h4>{item.title}</h4>
              {item.price && <p>💸 {item.price}</p>}
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  🔗 Перейти
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShoppingWishList;
