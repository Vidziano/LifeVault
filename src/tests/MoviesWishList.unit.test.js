// MoviesWishList.unit.test.js
import {
    addMovie,
    removeMovie,
    changeStatus,
    changeNote,
    setRating,
    getBadge,
    countWatched,
    updateGoal
  } from '../src/MoviesWishList.logic';
  
  describe('MoviesWishList логіка', () => {
    describe('addMovie()', () => {
      test('додає новий фільм, якщо його ще нема', () => {
        const initial = [];
        const movie = { id: '1', title: 'Фільм' };
        const result = addMovie(initial, movie);
        expect(result.length).toBe(1);
        expect(result[0].status).toBe('wantToWatch');
      });
  
      test('не додає фільм, якщо він уже існує', () => {
        const movie = { id: '1', title: 'Фільм' };
        const result = addMovie([movie], movie);
        expect(result.length).toBe(1);
      });
    });
  
    describe('removeMovie()', () => {
      test('видаляє фільм за id', () => {
        const initial = [{ id: '1' }, { id: '2' }];
        const result = removeMovie(initial, '1');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
      });
    });
  
    describe('changeStatus()', () => {
      test('цикл статусів фільму працює правильно', () => {
        const movie = { id: '1', status: 'wantToWatch' };
        const s1 = changeStatus([movie], '1')[0];
        expect(s1.status).toBe('watching');
  
        const s2 = changeStatus([s1], '1')[0];
        expect(s2.status).toBe('watched');
  
        const s3 = changeStatus([s2], '1')[0];
        expect(s3.status).toBe('wantToWatch');
      });
    });
  
    describe('changeNote()', () => {
      test('оновлює нотатку для фільму', () => {
        const movie = { id: '1', note: '' };
        const result = changeNote([movie], '1', 'Цікаво');
        expect(result[0].note).toBe('Цікаво');
      });
    });
  
    describe('setRating()', () => {
      test('встановлює рейтинг лише для вибраного фільму', () => {
        const movies = [{ id: '1', rating: 0 }, { id: '2', rating: 4 }];
        const updated = setRating(movies, '2', 5);
        expect(updated[0].rating).toBe(0);
        expect(updated[1].rating).toBe(5);
      });
    });
  
    describe('getBadge()', () => {
      test('повертає null якщо менше 1', () => {
        expect(getBadge(0)).toBeNull();
      });
  
      test('повертає правильний бейдж для різних кількостей', () => {
        const badges = {
          1: 'Перший перегляд',
          5: 'Перший рекорд',
          10: 'кіноман',
          20: 'Кіно-легенда',
          50: 'кінематографа'
        };
        Object.entries(badges).forEach(([val, text]) => {
          const badge = getBadge(Number(val));
          expect(badge).toContain(text);
        });
      });
    });
  
    describe('countWatched()', () => {
      test('підраховує лише переглянуті фільми', () => {
        const movies = [
          { id: '1', status: 'watched' },
          { id: '2', status: 'wantToWatch' },
          { id: '3', status: 'watched' }
        ];
        expect(countWatched(movies)).toBe(2);
      });
    });
  
    describe('updateGoal()', () => {
      test('повертає нову ціль, якщо вона > 0', () => {
        expect(updateGoal(10, 20)).toBe(20);
      });
  
      test('не оновлює ціль, якщо нова недійсна', () => {
        expect(updateGoal(10, 0)).toBe(10);
        expect(updateGoal(10, -5)).toBe(10);
      });
    });
  });
  