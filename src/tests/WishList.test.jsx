import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WishList from '../WishList';

jest.mock('../Dreams', () => () => <div data-testid="dreams-mock" />);
jest.mock('../BooksWishList', () => () => <div data-testid="books-mock" />);
jest.mock('../MoviesWishList', () => () => <div data-testid="movies-mock" />);
jest.mock('../ShoppingWishList', () => () => <div data-testid="shopping-mock" />);
jest.mock('../TravelWishMap', () => () => <div data-testid="travel-mock" />);

beforeEach(() => {
  jest.clearAllMocks();
});

test('рендерить головний екран з категоріями', () => {
  render(<WishList />);
  expect(screen.getByText(/Список бажань/i)).toBeInTheDocument();
  expect(document.querySelectorAll('.category-tile').length).toBeGreaterThanOrEqual(5);
});

test('відображає мрії при кліку на категорію "Мрії"', () => {
  render(<WishList />);
  fireEvent.click(screen.getByText(/Мрії/i));
  expect(screen.getByTestId('dreams-mock')).toBeInTheDocument();
});

test('відображає книги при кліку на категорію "Книги"', () => {
  render(<WishList />);
  fireEvent.click(screen.getByText(/Книги/i));
  expect(screen.getByTestId('books-mock')).toBeInTheDocument();
});

test('відображає фільми при кліку на категорію "Фільми"', () => {
  render(<WishList />);
  fireEvent.click(screen.getByText(/Фільми/i));
  expect(screen.getByTestId('movies-mock')).toBeInTheDocument();
});

test('відображає покупки при кліку на категорію "Покупки"', () => {
  render(<WishList />);
  fireEvent.click(screen.getByText(/Покупки/i));
  expect(screen.getByTestId('shopping-mock')).toBeInTheDocument();
});

test('відображає подорожі при кліку на категорію "Подорожі"', () => {
  render(<WishList />);
  fireEvent.click(screen.getByText(/Подорожі/i));
  expect(screen.getByTestId('travel-mock')).toBeInTheDocument();
});

test('повертається на головний екран після кліку "Назад"', () => {
  render(<WishList />);
  fireEvent.click(screen.getByText(/Мрії/i));
  expect(screen.getByTestId('dreams-mock')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /назад/i }));
  expect(screen.getByText(/Список бажань/i)).toBeInTheDocument();
});
