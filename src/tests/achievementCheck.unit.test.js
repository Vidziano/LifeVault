// achievementCheck.unit.test.js — юніт-тести для логіки перевірки досягнень
import {
    getNewlyCompletedAchievements,
    shouldTriggerAchievement
  } from '../src/achievementCheck.logic';
  
  describe('achievementCheck.logic — юніт-тести', () => {
    describe('getNewlyCompletedAchievements()', () => {
      const triggered = ['📓 Створити 1 нотатку'];
  
      test('фільтрує лише нові виконані досягнення', () => {
        const list = [
          { text: '📓 Створити 1 нотатку', done: true },
          { text: '📓 Створити 5 нотаток', done: true },
          { text: '📅 Створити подію', done: false }
        ];
  
        const result = getNewlyCompletedAchievements(list, triggered);
        expect(result).toHaveLength(1);
        expect(result[0].text).toBe('📓 Створити 5 нотаток');
      });
  
      test('повертає пустий масив, якщо все вже показано', () => {
        const list = [
          { text: '📓 Створити 1 нотатку', done: true }
        ];
        expect(getNewlyCompletedAchievements(list, triggered)).toEqual([]);
      });
  
      test('повертає пустий масив, якщо список порожній', () => {
        expect(getNewlyCompletedAchievements([], triggered)).toEqual([]);
      });
    });
  
    describe('shouldTriggerAchievement()', () => {
      const triggered = ['📚 Прочитати 5 книг'];
  
      test('true, якщо done=true і не в triggered', () => {
        const a = { text: '📚 Прочитати 10 книг', done: true };
        expect(shouldTriggerAchievement(a, triggered)).toBe(true);
      });
  
      test('false, якщо done=false', () => {
        const a = { text: '📚 Прочитати 5 книг', done: false };
        expect(shouldTriggerAchievement(a, triggered)).toBe(false);
      });
  
      test('false, якщо вже в списку triggered', () => {
        const a = { text: '📚 Прочитати 5 книг', done: true };
        expect(shouldTriggerAchievement(a, triggered)).toBe(false);
      });
    });
  });
  
  // Запуск:
  // npm test achievementCheck.unit.test.js
  