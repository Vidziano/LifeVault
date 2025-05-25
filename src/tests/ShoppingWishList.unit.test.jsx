import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShoppingWishList from '../ShoppingWishList';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('рендерить компонент ShoppingWishList', () => {
  render(<ShoppingWishList />);
  expect(screen.getByText('🛍️ Мій вішліст')).toBeInTheDocument();
});

test('додає новий елемент у список', () => {
  render(<ShoppingWishList />);

  fireEvent.change(screen.getByPlaceholderText('Назва товару'), {
    target: { value: 'Ноутбук' },
  });
  fireEvent.change(screen.getByPlaceholderText('Ціна'), {
    target: { value: '1000' },
  });

  fireEvent.click(screen.getByText('➕ Додати'));

  expect(screen.getByText('Ноутбук')).toBeInTheDocument();
  expect(screen.getByText(/💸 1000 ₴/)).toBeInTheDocument();
});

test('показує помилку при невалідному посиланні', () => {
  render(<ShoppingWishList />);
  fireEvent.change(screen.getByPlaceholderText('Назва товару'), {
    target: { value: 'Навушники' },
  });
  fireEvent.change(screen.getByPlaceholderText('Посилання на товар'), {
    target: { value: 'not-a-url' },
  });

  fireEvent.click(screen.getByText('➕ Додати'));

  expect(screen.getByText(/❗ Некоректне посилання/)).toBeInTheDocument();
});

test('редагує наявний елемент', async () => {
  render(<ShoppingWishList />);

  fireEvent.change(screen.getByPlaceholderText('Назва товару'), {
    target: { value: 'Телефон' },
  });
  fireEvent.click(screen.getByText('➕ Додати'));

  fireEvent.click(screen.getByText('✏️'));

  fireEvent.change(screen.getByPlaceholderText('Назва товару'), {
    target: { value: 'Новий телефон' },
  });
  fireEvent.click(screen.getByText('💾 Зберегти'));

  expect(await screen.findByText('Новий телефон')).toBeInTheDocument();
});

test('видаляє елемент зі списку', async () => {
  render(<ShoppingWishList />);

  fireEvent.change(screen.getByPlaceholderText('Назва товару'), {
    target: { value: 'Годинник' },
  });
  fireEvent.click(screen.getByText('➕ Додати'));

  fireEvent.click(screen.getByText('🗑️'));

  await waitFor(() =>
    expect(screen.queryByText('Годинник')).not.toBeInTheDocument()
  );
});

test('експортує список у JSON і копіює у буфер', async () => {
  // Мок localStorage з одним записом
  localStorage.setItem('shoppingList', JSON.stringify([
    { id: 1, title: 'Товар', price: '100 ₴', imageUrl: '', imageData: '', link: '' }
  ]));

  // Мокаємо clipboard API
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(),
    },
  });

  window.alert = jest.fn(); // заглушка alert

  render(<ShoppingWishList />);
  fireEvent.click(screen.getByText('📤 Поділитись'));

  expect(navigator.clipboard.writeText).toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('JSON скопійовано'));
});

test('імпортує список з коректного JSON', () => {
  const json = JSON.stringify([
    { id: 2, title: 'Імпортований товар', price: '50 ₴', imageUrl: '', imageData: '', link: '' }
  ]);

  window.prompt = jest.fn().mockReturnValue(json);
  render(<ShoppingWishList />);

  fireEvent.click(screen.getByText('📥 Імпорт'));

  expect(screen.getByText('Імпортований товар')).toBeInTheDocument();
});

test('не імпортує, якщо JSON некоректний', () => {
  window.prompt = jest.fn().mockReturnValue('{ некоректний }');
  window.alert = jest.fn();

  render(<ShoppingWishList />);
  fireEvent.click(screen.getByText('📥 Імпорт'));

  expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Помилка'));
});
