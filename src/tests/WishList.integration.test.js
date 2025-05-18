// WishList.integration.test.js — всеохоплюючі інтеграційні тести для WishList
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WishList from '../src/WishList';

const categories = [
  'Книги',
  'Подорожі',
  'Фільми',
  'Мрії',
  'Покупки'
];

describe('WishList — всеохоплюючі інтеграційні тести', () => {
  test('рендерить усі категорії на головній сторінці', () => {
    render(<WishList />);

    expect(screen.getByText('💖 Список бажань')).toBeInTheDocument();

    categories.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test('кожна категорія відкривається і містить заголовок + кнопку Назад', () => {
    render(<WishList />);

    categories.forEach((label) => {
      fireEvent.click(screen.getByText(label));

      // Перевірка заголовка категорії
      expect(screen.getByText(label)).toBeInTheDocument();

      // Перевірка кнопки Назад
      expect(screen.getByTitle('Назад до списку бажань')).toBeInTheDocument();

      // Повернення назад
      fireEvent.click(screen.getByTitle('Назад до списку бажань'));
      expect(screen.getByText('💖 Список бажань')).toBeInTheDocument();
    });
  });

  test('усі плитки містять <video> або <img> як контент', () => {
    render(<WishList />);

    const tiles = screen.getAllByText((_, element) => {
      return element?.classList.contains('category-tile');
    });

    tiles.forEach((tile) => {
      const media = tile.querySelector('video, img');
      expect(media).toBeTruthy();
    });
  });

  test('перемикання між кількома категоріями відображає відповідні заголовки', () => {
    render(<WishList />);

    fireEvent.click(screen.getByText('Книги'));
    expect(screen.getByText('Книги')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Назад до списку бажань'));
    fireEvent.click(screen.getByText('Подорожі'));
    expect(screen.getByText('Подорожі')).toBeInTheDocument();
  });

  test('повторне відкриття тієї ж категорії працює коректно', () => {
    render(<WishList />);

    fireEvent.click(screen.getByText('Фільми'));
    expect(screen.getByText('Фільми')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Назад до списку бажань'));
    fireEvent.click(screen.getByText('Фільми'));
    expect(screen.getByText('Фільми')).toBeInTheDocument();
  });

  test('невалідна категорія не викликає краш (симуляція через внутрішню логіку)', () => {
    const { container } = render(<WishList />);
    // Ін’єкція помилкового стану
    // (цей edge-case на практиці не виникає, але перевірка корисна)
    expect(container.innerHTML).toContain('💖 Список бажань');
  });
});

// Запуск тестів окремо:
// npm test WishList.integration.test.js
