import { render, screen } from '@testing-library/react';
import App from '../App';

test('рендерить App без помилок і показує головний інтерфейс', () => {
  render(<App />);
  // Використаємо getAllByText для унікального тексту
  const elements = screen.getAllByText(/Нотатки/i);
  expect(elements.length).toBeGreaterThan(0);
});
