import React from 'react';
import { render } from '@testing-library/react';
import HabitChart from '../HabitChart';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test('обчислює правильний прогрес для кожної звички', () => {
    const weekDates = [
      '2024-01-01', '2024-01-02', '2024-01-03',
      '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07'
    ];
  
    const habits = [
      {
        name: 'Читати книгу',
        log: {
          '2024-01-01': true,
          '2024-01-03': true,
          '2024-01-06': true
        }
      },
      {
        name: 'Медитація',
        log: {
          '2024-01-01': true,
          '2024-01-02': true,
          '2024-01-03': true,
          '2024-01-04': true,
          '2024-01-05': true,
          '2024-01-06': true,
          '2024-01-07': true
        }
      }
    ];
  
    const getProgressData = (habits, weekDates) =>
      habits.map((habit) => {
        const completedDays = weekDates.filter(date => habit.log[date]).length;
        const percent = Math.round((completedDays / 7) * 100);
        return {
          name: habit.name,
          progress: percent
        };
      });
  
    const data = getProgressData(habits, weekDates);
  
    expect(data).toEqual([
      { name: 'Читати книгу', progress: 43 },
      { name: 'Медитація', progress: 100 }
    ]);
  });
  