import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import QuickNotesWidget from '../QuickNotesWidget';

beforeEach(() => {
  localStorage.clear();
  window.dispatchEvent(new Event('storage'));
});

test('відображає кнопку 🗒️', () => {
  render(<QuickNotesWidget />);
  expect(screen.getByRole('button', { name: '🗒️' })).toBeInTheDocument();
});

test('відкриває панель після кліку на кнопку', () => {
  render(<QuickNotesWidget />);
  fireEvent.click(screen.getByRole('button', { name: '🗒️' }));
  expect(screen.getByText('📌 Швидкі нотатки')).toBeInTheDocument();
});

test('показує повідомлення, якщо немає улюблених нотаток', () => {
  render(<QuickNotesWidget />);
  fireEvent.click(screen.getByRole('button', { name: '🗒️' }));
  expect(screen.getByText('Немає обраних нотаток')).toBeInTheDocument();
});

test('відображає лише улюблені нотатки', () => {
  const mockNotes = [
    { id: 1, text: 'Test A', favorite: true, category: 'робота', created: '2023-01-01' },
    { id: 2, text: 'Test B', favorite: false, category: 'навчання', created: '2023-01-02' }
  ];
  localStorage.setItem('notes', JSON.stringify(mockNotes));

  render(<QuickNotesWidget />);
  fireEvent.click(screen.getByRole('button', { name: '🗒️' }));

  expect(screen.getByText('Test A')).toBeInTheDocument();
  expect(screen.queryByText('Test B')).not.toBeInTheDocument();
});

test('відображає зображення, якщо є fileUrl', () => {
  const mockNotes = [
    { id: 3, text: 'Photo note', favorite: true, fileUrl: 'http://example.com/pic.jpg', created: '2023-03-03', category: 'інше' }
  ];
  localStorage.setItem('notes', JSON.stringify(mockNotes));

  render(<QuickNotesWidget />);
  fireEvent.click(screen.getByRole('button', { name: '🗒️' }));

  expect(screen.getByAltText('note')).toBeInTheDocument();
});

test('закриває панель при натисканні ✖', () => {
  render(<QuickNotesWidget />);
  fireEvent.click(screen.getByRole('button', { name: '🗒️' }));
  expect(screen.getByText('📌 Швидкі нотатки')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '✖' }));
  expect(screen.queryByText('📌 Швидкі нотатки')).not.toBeInTheDocument();
});

test('оновлює нотатки при події storage', async () => {
  const mockNotes = [
    { id: 4, text: 'Updated note', favorite: true, category: 'інше', created: '2023-04-04' }
  ];
  localStorage.setItem('notes', JSON.stringify(mockNotes));

  render(<QuickNotesWidget />);
  await act(() => {
    window.dispatchEvent(new Event('storage'));
  });

  fireEvent.click(screen.getByRole('button', { name: '🗒️' }));
  expect(screen.getByText('Updated note')).toBeInTheDocument();
});

test('швидка нотатка має клас категорії', () => {
  const mockNotes = [
    { id: 5, text: 'категорія перевірка', favorite: true, category: 'робота', created: '2023-05-05' }
  ];
  localStorage.setItem('notes', JSON.stringify(mockNotes));

  render(<QuickNotesWidget />);
  fireEvent.click(screen.getByRole('button', { name: '🗒️' }));

  const note = screen.getByTestId('quick-note-5');
  expect(note).toHaveClass('робота');
});

