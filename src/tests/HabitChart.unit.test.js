// HabitChart.unit.test.js — юніт-тести для логіки HabitChart
import { getProgressData } from '../src/HabitChart.logic';

describe('getProgressData()', () => {
  const weekDates = [
    '2024-01-01',
    '2024-01-02',
    '2024-01-03',
    '2024-01-04',
    '2024-01-05',
    '2024-01-06',
    '2024-01-07'
  ];

  test('будує дані для графіку по звичках', () => {
    const habits = [
      {
        name: 'Медитація',
        completions: ['2024-01-01', '2024-01-03', '2024-01-07']
      },
      {
        name: 'Читання',
        completions: ['2024-01-02', '2024-01-04']
      }
    ];

    const result = getProgressData(habits, weekDates);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      label: 'Медитація',
      data: [1, 0, 1, 0, 0, 0, 1]
    });
    expect(result[1]).toEqual({
      label: 'Читання',
      data: [0, 1, 0, 1, 0, 0, 0]
    });
  });

  test('повертає порожній масив для некоректного вводу', () => {
    expect(getProgressData(null, weekDates)).toEqual([]);
    expect(getProgressData([], null)).toEqual([]);
  });
});
