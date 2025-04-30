import React, { useState } from 'react';
import './WishList.css';
import TravelWishMap from './TravelWishMap';
import BooksWishList from './BooksWishList'; 
<<<<<<< HEAD
import ShoppingWishList from './ShoppingWishList'; 
=======
import MoviesWishList from './MoviesWishList';

>>>>>>> ae6471e8b7daea372de0d6eb242d05e409cc4756

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
        <button className="back-btn" onClick={() => setActiveCategory(null)}>← Назад</button>
        <h2>{category.name}</h2>
    
        {activeCategory === 'travel' && <TravelWishMap />}
        {activeCategory === 'books' && <BooksWishList />}
<<<<<<< HEAD
        {activeCategory === 'shopping' && <ShoppingWishList />}
        {activeCategory !== 'travel' && activeCategory !== 'books' && activeCategory !== 'shopping' && (
=======
        {activeCategory === 'movies' && <MoviesWishList />}
        {activeCategory !== 'travel' && activeCategory !== 'books' && activeCategory !== 'movies' && (
>>>>>>> ae6471e8b7daea372de0d6eb242d05e409cc4756
          <p>Тут буде контент для: {activeCategory}</p>
        )}
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
