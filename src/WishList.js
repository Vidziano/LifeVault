import React, { useState } from 'react';
import './WishList.css';
import TravelWishList from './TravelWishList';

const categories = [
  {
    name: 'Книги',
    key: 'books',
    video: 'https://cdn-icons-mp4.flaticon.com/512/15557/15557327.mp4'
  },
  {
    name: 'Подорожі',
    key: 'travel',
    video: 'https://cdn-icons-mp4.flaticon.com/512/12753/12753542.mp4'
  },
  {
    name: 'Фільми',
    key: 'movies',
    video: 'https://cdn-icons-mp4.flaticon.com/512/12749/12749767.mp4'
  },
  {
    name: 'Мрії',
    key: 'dreams',
    video: 'https://cdn-icons-mp4.flaticon.com/512/14696/14696919.mp4'
  },
  {
    name: 'Покупки',
    key: 'shopping',
    video: 'https://cdn-icons-mp4.flaticon.com/512/13896/13896301.mp4'
  }
];

function WishList() {
  const [activeCategory, setActiveCategory] = useState(null);

  const renderCategoryContent = () => {
    if (activeCategory === 'travel') {
      return <TravelWishList onBack={() => setActiveCategory(null)} />;
    }

    const current = categories.find(cat => cat.key === activeCategory);
    return (
      <div className="wish-subpage">
        <button className="back-btn" onClick={() => setActiveCategory(null)}>← Назад</button>
        <h2>{current.name}</h2>
        <p>Тут буде контент для: {activeCategory}</p>
      </div>
    );
  };

  return (
    <div className="wish-list">
      {activeCategory ? (
        renderCategoryContent()
      ) : (
        <>
          <h2>💖 Список бажань</h2>
          <div className="category-grid">
            {categories.map(cat => (
              <div key={cat.key} className="category-tile" onClick={() => setActiveCategory(cat.key)}>
                {cat.video ? (
                  <video className="category-icon" autoPlay loop muted playsInline>
                    <source src={cat.video} type="video/mp4" />
                    Ваш браузер не підтримує відео.
                  </video>
                ) : (
                  <img src={cat.icon} alt={cat.name} className="category-icon" />
                )}
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default WishList;
