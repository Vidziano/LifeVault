// QuickNotesWidget.unit.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickNotesWidget from '../QuickNotesWidget';

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe('QuickNotesWidget юніт-тести', () => {
  test('рендерить кнопку 🗒️', () => {
    render(<QuickNotesWidget />);
    expect(screen.getByText('🗒️')).toBeInTheDocument();
  });

  test('відкриває і закриває панель', () => {
    render(<QuickNotesWidget />);
    fireEvent.click(screen.getByText('🗒️'));
    expect(screen.getByText('📌 Швидкі нотатки')).toBeInTheDocument();
    fireEvent.click(screen.getByText('✖'));
    expect(screen.queryByText('📌 Швидкі нотатки')).not.toBeInTheDocument();
  });

  test('показує повідомлення, якщо немає обраних нотаток', () => {
    render(<QuickNotesWidget />);
    fireEvent.click(screen.getByText('🗒️'));
    expect(screen.getByText('Немає обраних нотаток')).toBeInTheDocument();
  });

  test('відображає улюблені нотатки з localStorage', () => {
    const notes = [
      { id: 1, text: 'Привіт', favorite: true, category: 'робота', created: '2024-05-01' },
      { id: 2, text: 'Не улюблена', favorite: false }
    ];
    localStorage.setItem('notes', JSON.stringify(notes));

    render(<QuickNotesWidget />);
    fireEvent.click(screen.getByText('🗒️'));

    expect(screen.getByTestId('quick-note-1')).toBeInTheDocument();
    expect(screen.queryByTestId('quick-note-2')).not.toBeInTheDocument();
    expect(screen.getByText('Привіт')).toBeInTheDocument();
  });

  test('рендерить зображення, якщо fileUrl присутній', () => {
    const notes = [
      {
        id: 3,
        text: 'З фото',
        favorite: true,
        fileUrl: 'http://example.com/image.png',
        created: '2024-05-01'
      }
    ];
    localStorage.setItem('notes', JSON.stringify(notes));

    render(<QuickNotesWidget />);
    fireEvent.click(screen.getByText('🗒️'));

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'http://example.com/image.png');
  });
});
