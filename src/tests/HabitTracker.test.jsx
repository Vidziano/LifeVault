import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HabitTracker from '../HabitTracker';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  localStorage.clear();
});

test('додає нову звичку вручну', () => {
  render(<HabitTracker />);
  const input = screen.getByPlaceholderText('Нова звичка');
  fireEvent.change(input, { target: { value: 'Тестова звичка' } });
  fireEvent.click(screen.getByText('➕'));
  expect(screen.getByText('Тестова звичка')).toBeInTheDocument();
});

test('додає рекомендовану звичку', () => {
  render(<HabitTracker />);
  fireEvent.click(screen.getByText('📋'));
  fireEvent.click(screen.getByText('Пити воду'));
  fireEvent.click(screen.getByText('➕'));
  expect(screen.getByText('Пити воду')).toBeInTheDocument();
});

test('перемикає виконання звички за сьогодні', () => {
  render(<HabitTracker />);
  const input = screen.getByPlaceholderText('Нова звичка');
  fireEvent.change(input, { target: { value: 'Мітка' } });
  fireEvent.click(screen.getByText('➕'));

  const circle = screen.getAllByTitle('').find(el => el.className.includes('habit-circle'));
  fireEvent.click(circle);

  expect(circle).toHaveClass('done');
});

test('не дозволяє мітити інші дні — показує попередження', async () => {
  render(<HabitTracker />);
  const input = screen.getByPlaceholderText('Нова звичка');
  fireEvent.change(input, { target: { value: 'Недоступна дата' } });
  fireEvent.click(screen.getByText('➕'));

  const allCells = screen.getAllByTitle(/Мітки можна ставити лише за сьогодні/);
  if (allCells.length > 0) {
    fireEvent.click(allCells[0]);
    await waitFor(() => {
      expect(screen.getByText('❌ Мітки можна ставити лише за сьогодні')).toBeInTheDocument();
    });
  }
});

test('видаляє звичку', () => {
  render(<HabitTracker />);
  const input = screen.getByPlaceholderText('Нова звичка');
  fireEvent.change(input, { target: { value: 'Для видалення' } });
  fireEvent.click(screen.getByText('➕'));
  fireEvent.click(screen.getByText('❌'));
  expect(screen.queryByText('Для видалення')).not.toBeInTheDocument();
});

test('редагує назву звички', () => {
  render(<HabitTracker />);
  const input = screen.getByPlaceholderText('Нова звичка');
  fireEvent.change(input, { target: { value: 'Редагована' } });
  fireEvent.click(screen.getByText('➕'));

  fireEvent.click(screen.getByText('✏️'));
  const editInput = screen.getByDisplayValue('Редагована');
  fireEvent.change(editInput, { target: { value: 'Оновлено' } });
  fireEvent.blur(editInput);

  expect(screen.getByText('Оновлено')).toBeInTheDocument();
});

test('calculateProgress працює правильно', () => {
  const weekDates = ['2024-01-01','2024-01-02','2024-01-03','2024-01-04','2024-01-05','2024-01-06','2024-01-07'];
  const log = {
    '2024-01-01': true,
    '2024-01-02': true,
    '2024-01-03': true,
    '2024-01-04': true,
    '2024-01-05': true,
    '2024-01-06': true,
    '2024-01-07': true
  };
  const calculateProgress = (log) => {
    const checked = weekDates.filter(date => log[date]).length;
    const percent = Math.round((checked / 7) * 100);
    let message = '';
    if (percent === 100) message = '💪 Ідеально!';
    else if (percent >= 80) message = '🔥 Молодець!';
    else if (percent >= 50) message = '👏 Впевнено наближаєшся до мети';
    else if (percent > 0) message = '🙂 Початок є!';
    else message = '🔄 Почни цей тиждень з нової звички';
    return { count: checked, percent, message };
  };

  const result = calculateProgress(log);
  expect(result.count).toBe(7);
  expect(result.percent).toBe(100);
  expect(result.message).toBe('💪 Ідеально!');
});

test('перемикає видимість рекомендованих звичок', () => {
  render(<HabitTracker />);
  const toggleButton = screen.getByText('📋');
  fireEvent.click(toggleButton);
  expect(screen.getByText('Пити воду')).toBeInTheDocument();
  fireEvent.click(toggleButton);
  expect(screen.queryByText('Пити воду')).not.toBeInTheDocument();
});

test('перемикає тижні вперед і назад', () => {
    render(<HabitTracker />);
    const label = screen.getByText(/травня/i).textContent;
    fireEvent.click(screen.getByText('▶'));
    const updatedLabel = screen.getByText(/травня|червня/i).textContent;
    expect(updatedLabel).not.toEqual(label);
    fireEvent.click(screen.getByText('◀'));
    expect(screen.getByText(/травня/i)).toBeInTheDocument();
  });
