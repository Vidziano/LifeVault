// WishList.logic.js — спрощений для юніт-тестів
import React from 'react';

export const renderCategoryContent = (key, setActiveCategory) => {
  const Component = (label) => <div key={key}>{label}</div>;

  const map = {
    travel: Component('TravelWishMap'),
    books: Component('BooksWishList'),
    shopping: Component('ShoppingWishList'),
    movies: Component('MoviesWishList'),
    dreams: Component('Dreams')
  };

  return map[key] || null;
};
