import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WishList from '../WishList';

jest.mock('../BooksWishList', () => () => <div data-testid="books-content">BooksWishList</div>);
jest.mock('../MoviesWishList', () => () => <div data-testid="movies-content">MoviesWishList</div>);
jest.mock('../DreamChart', () => () => <div data-testid="dreams-content">DreamChart</div>);
jest.mock('../ShoppingWishList', () => () => <div data-testid="shopping-content">ShoppingWishList</div>);
jest.mock('../TravelWishMap', () => () => <div data-testid="travel-content">TravelWishMap</div>);

describe('WishList integration', () => {
  beforeEach(() => {
    render(<WishList />);
  });

  test('рендерить усі категорії', () => {
    expect(screen.getByText('Книги')).toBeInTheDocument();
    expect(screen.getByText('Фільми')).toBeInTheDocument();
    expect(screen.getByText('Мрії')).toBeInTheDocument();
    expect(screen.getByText('Покупки')).toBeInTheDocument();
    expect(screen.getByText('Подорожі')).toBeInTheDocument();
  });

  test('відкриває та закриває категорію Книги', () => {
    fireEvent.click(screen.getByText('Книги'));
    expect(screen.getByTestId('books-content')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Назад до списку бажань'));
    expect(screen.getByText('Книги')).toBeInTheDocument();
  });

  test('відкриває всі категорії по черзі', () => {
    const categories = [
      { label: 'Книги', testId: 'books-content' },
      { label: 'Фільми', testId: 'movies-content' },
      { label: 'Мрії', testId: 'dreams-content' },
      { label: 'Покупки', testId: 'shopping-content' },
      { label: 'Подорожі', testId: 'travel-content' },
    ];

    categories.forEach(({ label, testId }) => {
      fireEvent.click(screen.getByText(label));
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Назад до списку бажань'));
    });
  });

  test('не рендерить нічого при невідомій категорії', () => {
    expect(screen.getByText('Книги')).toBeInTheDocument();
  });
});
