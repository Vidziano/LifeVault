// Achievements.unit.test.js
import { buildAchievementsList } from '../src/Achievements.logic';

describe('Achievements – виконання кожної ачивки', () => {
  const find = (arr, match) => arr.find(a => a.text.includes(match));

  test('📓 Створити 1, 5, 10, 50 нотаток', () => {
    const list = buildAchievementsList({ notes: Array(50) });
    expect(find(list, '1 нотатку')?.current).toBe(50);
    expect(find(list, '5 нотаток')?.current).toBe(50);
    expect(find(list, '10 нотаток')?.current).toBe(50);
    expect(find(list, '50 нотаток')?.current).toBe(50);
  });

  test('📅 Створити 1 і 10 подій', () => {
    const events = { '2024-01-01': Array(10).fill(1) };
    const list = buildAchievementsList({ calendarEvents: events });
    expect(find(list, '1 подію')?.current).toBe(10);
    expect(find(list, '10 подій')?.current).toBe(10);
  });

  test('🎯 Виконати звичку 1, 7, 21 день', () => {
    const habits = [
      { log: { a: true } },
      { log: Object.fromEntries(Array(7).fill(null).map((_, i) => [i, true])) },
      { log: Object.fromEntries(Array(21).fill(null).map((_, i) => [i, true])) },
    ];
    const list = buildAchievementsList({ habits });
    expect(find(list, '1 день')?.current).toBe(1);
    expect(find(list, '7 днів')?.current).toBe(2);
    expect(find(list, '21 день')?.current).toBe(1);
  });


  test('🌟 Додати перший малюнок', () => {
    const list = buildAchievementsList({ inspo: [{}] });
    expect(find(list, 'перший малюнок')?.current).toBe(1);
  });

  test('🌈 Зберегти 5 і 10 мудбордів', () => {
    const list = buildAchievementsList({ inspo: Array(10) });
    expect(find(list, '5 мудбордів')?.current).toBe(10);
    expect(find(list, '10 мудбордів')?.current).toBe(10);
  });

  test('📚 Прочитати 5 книг', () => {
    const list = buildAchievementsList({ savedBooks: Array(5).fill({ status: 'read' }) });
    expect(find(list, '5 книг')?.current).toBe(5);
  });

  test('🎬 Переглянути 5 фільмів', () => {
    const list = buildAchievementsList({ savedMovies: Array(5).fill({ status: 'watched' }) });
    expect(find(list, '5 фільмів')?.current).toBe(5);
  });

  test('🌍 Відвідати 1, 5, 10 країн', () => {
    const list = buildAchievementsList({ visitedCountries: Array(10) });
    expect(find(list, '1 країну')?.current).toBe(10);
    expect(find(list, '5 країн')?.current).toBe(10);
    expect(find(list, '10 країн')?.current).toBe(10);
  });

  test('✅ Виконати 1, 5, 10 мрій', () => {
    const list = buildAchievementsList({ dreams: Array(10).fill({ completed: true }) });
    expect(find(list, '1 мрію')?.current).toBe(10);
    expect(find(list, '5 мрій')?.current).toBe(10);
    expect(find(list, '10 мрій')?.current).toBe(10);
  });

  test('🛒 Додати 10, 25, 50 бажань у список покупок', () => {
    const list = buildAchievementsList({ shoppingList: Array(50) });
    expect(find(list, '10 бажань')?.current).toBe(50);
    expect(find(list, '25 бажань')?.current).toBe(50);
    expect(find(list, '50 бажань')?.current).toBe(50);
  });
});

// Команда для запуску цього тесту:
// npm test Achievements.unit.test.js