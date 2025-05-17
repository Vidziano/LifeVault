// HabitTracker.unit.test.js — юніт-тести для логіки прогресу звичок
import { calculateProgress } from '../src/HabitTracker.logic';

describe('calculateProgress()', () => {
  const baseDate = new Date('2024-01-01'); // Вівторок
  const getDateStr = (offset) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offset);
    return d.toISOString();
  };

  test('рахує 0%, якщо немає виконань', () => {
    const habit = { completions: [] };
    const progress = calculateProgress(habit, baseDate);
    expect(progress).toBe(0);
  });

  test('рахує 100%, якщо виконано всі дні тижня', () => {
    const completions = Array.from({ length: 7 }, (_, i) => getDateStr(i));
    const habit = { completions };
    const progress = calculateProgress(habit, baseDate);
    expect(progress).toBe(100);
  });

  test('рахує коректний відсоток', () => {
    const habit = {
      completions: [getDateStr(0), getDateStr(1), getDateStr(2)] // 3 з 7
    };
    const progress = calculateProgress(habit, baseDate);
    expect(progress).toBe(Math.round((3 / 7) * 100));
  });

  test('ігнорує дати поза тижнем', () => {
    const habit = {
      completions: [getDateStr(-1), getDateStr(0), getDateStr(10)]
    };
    const progress = calculateProgress(habit, baseDate);
    expect(progress).toBe(Math.round((1 / 7) * 100));
  });

  test('повертає 0, якщо невалідні вхідні дані', () => {
    expect(calculateProgress(null, baseDate)).toBe(0);
    expect(calculateProgress({}, baseDate)).toBe(0);
  });
});
