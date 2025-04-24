import React, { useState } from 'react';
import './WishList.css';

const categories = [
  { name: 'Книги', key: 'books' },
  { name: 'Подорожі', key: 'travel' },
  { name: 'Фільми', key: 'movies' },
  { name: 'Мрії', key: 'dreams' },
  { name: 'Покупки', key: 'shopping' }
];

function WishList() {
  const [activeCategory, setActiveCategory] = useState(null);

  if (activeCategory) {
    return (
      <div className="wish-subpage">
        <button className="back-btn" onClick={() => setActiveCategory(null)}>← Назад</button>
        <h2>{categories.find(cat => cat.key === activeCategory).name}</h2>
        <p>Тут буде контент для: {activeCategory}</p>
        {/* Додамо окремі компоненти згодом */}
      </div>
    );
  }

  return (
    <div className="wish-list">
      <h2>💖 Список бажань</h2>
      <div className="category-grid">
        {categories.map(cat => (
          <div
            key={cat.key}
            className="category-tile"
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishList;
