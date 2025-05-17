// MotivationalQuote.unit.test.js — юніт-тести для логіки цитат
import { getInitialQuote, getNewRandomQuote } from '../src/MotivationalQuote.logic';

describe('MotivationalQuote.logic — юніт-тести', () => {
  const quotes = ['Цитата 1', 'Цитата 2', 'Цитата 3'];

  describe('getInitialQuote()', () => {
    test('повертає цитату за датою (стабільну)', () => {
      const result = getInitialQuote(quotes);
      expect(quotes).toContain(result);
    });

    test('повертає порожній рядок, якщо список порожній', () => {
      expect(getInitialQuote([])).toBe('');
      expect(getInitialQuote(null)).toBe('');
    });
  });

  describe('getNewRandomQuote()', () => {
    test('повертає іншу цитату, ніж поточна', () => {
      const current = 'Цитата 2';
      const result = getNewRandomQuote(quotes, current);
      expect(result).not.toBe(current);
      expect(quotes).toContain(result);
    });

    test('повертає поточну, якщо список має лише 1 цитату', () => {
      const result = getNewRandomQuote(['Єдина'], 'Єдина');
      expect(result).toBe('Єдина');
    });

    test('повертає поточну, якщо список невалідний', () => {
      expect(getNewRandomQuote(null, 'Цитата')).toBe('Цитата');
      expect(getNewRandomQuote([], 'Цитата')).toBe('Цитата');
    });
  });
});
