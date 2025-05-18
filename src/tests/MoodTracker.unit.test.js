// MoodTracker.unit.test.js — юніт-тести для логіки MoodTracker
import {
    getFilteredData,
    getBestAndWorstDays,
    formatWeekLabel,
    handleExtraEmoji
  } from '../src/MoodTracker.logic';
  
  describe('MoodTracker.logic — юніт-тести', () => {
  //  const baseDate = new Date('2024-01-01');
  
    describe('getFilteredData()', () => {
      const history = [
        { date: '2024-01-01', mood: '🙂' },
        { date: '2024-01-03', mood: '😞' },
        { date: '2024-01-10', mood: '😊' }
      ];
  
      test('фільтрує по тижню', () => {
        const weekStart = new Date('2024-01-01');
        const result = getFilteredData(history, 'week', weekStart);
        expect(result).toHaveLength(2);
      });
  
      test('фільтрує по місяцю', () => {
        const result = getFilteredData(history, 'month', null, 0, 2024);
        expect(result).toHaveLength(3);
      });
  
      test('повертає все за замовчуванням', () => {
        const result = getFilteredData(history, 'all');
        expect(result).toHaveLength(3);
      });
    });
  
    describe('getBestAndWorstDays()', () => {
      const mainEmojis = ['😵', '😞', '🙂', '😊', '😄'];
      const filtered = [
        { mood: '😞', date: '2024-01-01' },
        { mood: '😄', date: '2024-01-02' },
        { mood: '🙂', date: '2024-01-03' }
      ];
  
      test('знаходить найкращий і найгірший день', () => {
        const { best, worst } = getBestAndWorstDays(filtered, mainEmojis);
        expect(best.mood).toBe('😄');
        expect(worst.mood).toBe('😞');
      });
  
      test('повертає null, якщо порожній вхід', () => {
        const result = getBestAndWorstDays([], mainEmojis);
        expect(result.best).toBeNull();
        expect(result.worst).toBeNull();
      });
    });
  
    describe('formatWeekLabel()', () => {
      test('повертає форматований діапазон дат', () => {
        const result = formatWeekLabel(new Date('2024-01-01'));
        expect(result).toMatch(/2024.*2024/);
      });
    });
  
    describe('handleExtraEmoji()', () => {
      test('додає emoji до коментаря', () => {
        expect(handleExtraEmoji('Hello ', '🎉')).toBe('Hello 🎉');
      });
    });
  });
  