// TravelWishMap.unit.test.js
import {
    toggleCountryLogic,
    getColor,
    handleFieldToggleLogic,
    handleChangeLogic
  } from '../src/TravelWishMap.logic';
  
  describe('TravelWishMap логіка', () => {
    describe('toggleCountryLogic()', () => {
      const country = { id: 'UA', name: 'Україна' };
  
      test('додає країну, якщо її ще нема', () => {
        const result = toggleCountryLogic([], 'UA', 'Україна');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('UA');
        expect(result[0].showCity).toBe(false);
      });
  
      test('видаляє країну, якщо вона вже є', () => {
        const initial = [country];
        const result = toggleCountryLogic(initial, 'UA', 'Україна');
        expect(result).toHaveLength(0);
      });
    });
  
    describe('getColor()', () => {
      const id = 'UA';
      test('повертає зелений, якщо країна у відвіданих', () => {
        const result = getColor(id, [{ id: 'UA' }], []);
        expect(result).toBe('#69e36a');
      });
  
      test('повертає синій, якщо країна у мріях', () => {
        const result = getColor(id, [], [{ id: 'UA' }]);
        expect(result).toBe('#83cfff');
      });
  
      test('повертає сірий, якщо країна ніде', () => {
        const result = getColor(id, [], []);
        expect(result).toBe('#e0e0e0');
      });
    });
  
    describe('handleFieldToggleLogic()', () => {
      const list = [{ id: 'UA', showCity: false }];
  
      test('перемикає булеве поле', () => {
        const updated = handleFieldToggleLogic(list, 'UA', 'showCity');
        expect(updated[0].showCity).toBe(true);
      });
    });
  
    describe('handleChangeLogic()', () => {
      const list = [{ id: 'UA', city: '' }];
  
      test('оновлює значення поля', () => {
        const updated = handleChangeLogic(list, 'UA', 'city', 'Київ');
        expect(updated[0].city).toBe('Київ');
      });
    });
  });
  