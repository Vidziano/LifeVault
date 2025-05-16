import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MotivationalQuote from '../MotivationalQuote';

describe('MotivationalQuote', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('рендерить цитату за замовчуванням', () => {
    render(<MotivationalQuote />);
    expect(screen.getByText(/💬/)).toBeInTheDocument();
  });

  test('кнопка оновлення присутня', () => {
    render(<MotivationalQuote />);
    const button = screen.getByRole('button', { name: /🔁/i });
    expect(button).toBeInTheDocument();
  });

  test('оновлює цитату при кліку', () => {
    render(<MotivationalQuote />);
    const initial = screen.getByText(/💬/).textContent;
    const button = screen.getByRole('button', { name: /🔁/i });
    fireEvent.click(button);
    const updated = screen.getByText(/💬/).textContent;
    expect(updated).not.toBe(initial);
  });

  test('відображає правильну структуру DOM', () => {
    render(<MotivationalQuote />);
    expect(screen.getByText(/💬/).parentElement).toHaveClass('quote-line');
    expect(screen.getByText(/💬/).closest('.motivational-quote')).toBeInTheDocument();
  });

  test('цитата детермінована для певної дати', () => {
    render(<MotivationalQuote />);
    const quote = screen.getByText(/💬/).textContent;
    expect(quote).toMatch(/💬\s*\d+\.\s+/); // має бути щось типу "💬 137. ... "
  });
});
