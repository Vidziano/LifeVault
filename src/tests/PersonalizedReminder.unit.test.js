// PersonalizedReminder.unit.test.js
import {
    getRandomIndex,
    getReminderFromIndex,
    shouldShowReminder
  } from '../src/PersonalizedReminder.logic';
  
  describe('PersonalizedReminder логіка — юніт-тести', () => {
    describe('getRandomIndex()', () => {
      test('повертає ціле число в межах довжини', () => {
        for (let i = 0; i < 10; i++) {
          const index = getRandomIndex(5);
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThan(5);
        }
      });
  
      test('повертає 0 для некоректної довжини', () => {
        expect(getRandomIndex(0)).toBe(0);
        expect(getRandomIndex(-1)).toBe(0);
        expect(getRandomIndex()).toBe(0);
      });
    });
  
    describe('getReminderFromIndex()', () => {
      const reminders = ['A', 'B', 'C'];
  
      test('повертає правильний нагадувач за індексом', () => {
        expect(getReminderFromIndex(reminders, 0)).toBe('A');
        expect(getReminderFromIndex(reminders, 1)).toBe('B');
        expect(getReminderFromIndex(reminders, 2)).toBe('C');
      });
  
      test('повертає коректно, навіть якщо індекс перевищує довжину', () => {
        expect(getReminderFromIndex(reminders, 4)).toBe('B'); // 4 % 3 = 1
      });
  
      test('повертає null, якщо reminders не валідний', () => {
        expect(getReminderFromIndex([], 0)).toBeNull();
        expect(getReminderFromIndex(null, 0)).toBeNull();
      });
    });
  
    describe('shouldShowReminder()', () => {
      test('повертає true, якщо ввімкнено', () => {
        expect(shouldShowReminder(true)).toBe(true);
      });
  
      test('повертає false, якщо вимкнено або невизначено', () => {
        expect(shouldShowReminder(false)).toBe(false);
        expect(shouldShowReminder(undefined)).toBe(false);
      });
    });
  });
  