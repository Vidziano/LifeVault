import React, { useState } from 'react';
import './WishList.css';
import TravelWishMap from './TravelWishMap';
import BooksWishList from './BooksWishList'; 
import ShoppingWishList from './ShoppingWishList'; 
import MoviesWishList from './MoviesWishList';
import Dreams from './Dreams';

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
    if (!activeCategory) return null;

    const category = categories.find(cat => cat.key === activeCategory);

    return (
      <div className="wish-subpage">
        <button className="icon-back-btn" onClick={() => setActiveCategory(null)} title="Назад до списку бажань">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        <h2>{category.name}</h2>

        {activeCategory === 'travel' && <TravelWishMap />}
        {activeCategory === 'books' && <BooksWishList />}
        {activeCategory === 'shopping' && <ShoppingWishList />}
        {activeCategory === 'movies' && <MoviesWishList />}
        {activeCategory === 'dreams' && <Dreams />}
      </div>
    );
  };

  return (
    <div className={`wish-list ${!activeCategory ? 'wishlist-home' : ''}`}>

      {activeCategory ? (
        renderCategoryContent()
      ) : (
        <>
          <h3>💖 Список бажань</h3>
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
