import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HabitTracker from '../HabitTracker';

// 🛠 Мок для recharts (ResizeObserver)
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  localStorage.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('додає нову звичку і показує її в таблиці', () => {
  render(<HabitTracker />);
  fireEvent.change(screen.getByPlaceholderText('Нова звичка'), { target: { value: 'Тестова звичка' } });
  fireEvent.click(screen.getByRole('button', { name: '➕' }));
  expect(screen.getByText('Тестова звичка')).toBeInTheDocument();
});
  
  

test('показує попередження при спробі відмітити несьогоднішній день', () => {
  render(<HabitTracker />);
  fireEvent.change(screen.getByPlaceholderText('Нова звичка'), { target: { value: 'Звичка' } });
  fireEvent.click(screen.getByRole('button', { name: '➕' }));

  const notTodayCell = screen.getAllByRole('cell')
    .flatMap(cell => Array.from(cell.querySelectorAll('.habit-circle')))
    .find(circle => circle.title === 'Мітки можна ставити лише за сьогодні');

  fireEvent.click(notTodayCell);
  expect(screen.getByText(/мітки можна ставити лише за сьогодні/i)).toBeInTheDocument();
});

test('редагує назву звички', () => {
  render(<HabitTracker />);
  fireEvent.change(screen.getByPlaceholderText('Нова звичка'), { target: { value: 'Стара назва' } });
  fireEvent.click(screen.getByRole('button', { name: '➕' }));

  fireEvent.click(screen.getByRole('button', { name: '✏️' }));
  const input = screen.getByDisplayValue('Стара назва');
  fireEvent.change(input, { target: { value: 'Нова назва' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  expect(screen.getByText('Нова назва')).toBeInTheDocument();
});

test('видаляє звичку', () => {
  render(<HabitTracker />);
  fireEvent.change(screen.getByPlaceholderText('Нова звичка'), { target: { value: 'Для видалення' } });
  fireEvent.click(screen.getByRole('button', { name: '➕' }));
  fireEvent.click(screen.getByRole('button', { name: '❌' }));

  expect(screen.queryByText('Для видалення')).not.toBeInTheDocument();
});

test('відображає список рекомендованих звичок і вибирає одну', () => {
  render(<HabitTracker />);
  fireEvent.click(screen.getByRole('button', { name: '📋' }));
  fireEvent.click(screen.getByText('Пити воду'));

  expect(screen.getByDisplayValue('Пити воду')).toBeInTheDocument();
});

test('зберігає звичку в localStorage', () => {
  render(<HabitTracker />);
  fireEvent.change(screen.getByPlaceholderText('Нова звичка'), { target: { value: 'Локальна' } });
  fireEvent.click(screen.getByRole('button', { name: '➕' }));

  const stored = JSON.parse(localStorage.getItem('habits'));
  expect(stored[0].name).toBe('Локальна');
});

test('змінює тиждень при натисканні ▶', () => {
  render(<HabitTracker />);
  const labelBefore = screen.getByText(/–/).textContent;
  fireEvent.click(screen.getByRole('button', { name: '▶' }));
  const labelAfter = screen.getByText(/–/).textContent;

  expect(labelAfter).not.toBe(labelBefore);
});
  
  

test('рендерить компонент HabitChart', () => {
  render(<HabitTracker />);
  expect(screen.getByText(/прогрес за тиждень/i)).toBeInTheDocument();
});
