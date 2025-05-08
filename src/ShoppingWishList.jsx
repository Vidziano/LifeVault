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
    price: '',
    currency: '₴'
  });

  const [editingId, setEditingId] = useState(null);
  const [linkError, setLinkError] = useState('');

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'link') {
      if (value && !isValidURL(value)) {
        setLinkError('❗ Некоректне посилання');
      } else {
        setLinkError('');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        imageData: reader.result,
        imageFile: file,
        imageUrl: file.name // автоматично підставити назву в поле
      }));
    };
    reader.readAsDataURL(file);
  };

  const isValidURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const addOrUpdateItem = () => {
    if (!formData.title.trim()) return;

    if (formData.link && !isValidURL(formData.link)) {
      setLinkError('❗ Некоректне посилання');
      return;
    }

    const newItem = {
      id: editingId ?? Date.now(),
      title: formData.title,
      link: formData.link,
      price: formData.price ? `${formData.price} ${formData.currency}` : '',
      imageUrl: formData.imageUrl,
      imageData: formData.imageData
    };

    const updatedItems = editingId
      ? savedItems.map(item => (item.id === editingId ? newItem : item))
      : [newItem, ...savedItems];

    setSavedItems(updatedItems);
    setFormData({
      title: '',
      link: '',
      imageFile: null,
      imageUrl: '',
      imageData: '',
      price: '',
      currency: '₴'
    });
    setLinkError('');
    setEditingId(null);
  };

  const removeItem = (id) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const startEdit = (item) => {
    const [priceValue, currency = '₴'] = item.price?.split(' ') || ['', '₴'];
    setFormData({
      title: item.title,
      link: item.link,
      price: priceValue,
      currency: currency,
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
        {linkError && <div className="field-error">{linkError}</div>}

        <div className="input-with-attachment">
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="Посилання на зображення"
          />
          <label className="file-upload">
            📎
            <input type="file" onChange={handleFileChange} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="Ціна"
          />
          <select
            value={formData.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
          >
            <option value="₴">₴</option>
            <option value="$">$</option>
            <option value="€">€</option>
          </select>
        </div>

        <button onClick={addOrUpdateItem}>
          {editingId ? '💾 Зберегти' : '➕ Додати'}
        </button>
        <button onClick={exportList}>📤 Поділитись</button>
        <button onClick={importList}>📥 Імпорт</button>
      </div>

      <div className="shopping-list">
        {savedItems.map(item => (
          <div className="shopping-card">
          <div className="card-header">
            <div className="card-actions">
              <button className="edit-button" onClick={() => startEdit(item)}>✏️</button>
              <button className="delete-button" onClick={() => removeItem(item.id)}>🗑️</button>
            </div>
          </div>
        
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
