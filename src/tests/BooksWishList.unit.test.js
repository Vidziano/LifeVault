import { getBadge, addBook, changeStatus, setRating, updateGoal } from '../src/BooksWishList.logic';


describe('BooksWishList логіка', () => {
  describe('getBadge()', () => {
    test('повертає null, якщо count = 0', () => {
      expect(getBadge(0)).toBeNull();
    });

    test('повертає правильний бейдж для кожного порогу', () => {
      expect(getBadge(1)).toContain('Перша');
      expect(getBadge(5)).toContain('Перший');
      expect(getBadge(10)).toContain('Справжній');
      expect(getBadge(25)).toContain('Захоплений');
      expect(getBadge(100)).toContain('Абсолютний');
    });
  });

  describe('addBook()', () => {
    test('додає нову книгу, якщо її ще нема', () => {
      const initial = [];
      const book = { id: 'abc', title: 'Книга', author: 'Автор' };
      const updated = addBook(initial, book);
      expect(updated.length).toBe(1);
      expect(updated[0].status).toBe('wantToRead');
    });

    test('не додає книгу, якщо вона вже є', () => {
      const book = { id: 'abc', title: 'Книга' };
      const updated = addBook([book], book);
      expect(updated.length).toBe(1);
    });
  });

  describe('changeStatus()', () => {
    test('циклічно змінює статус книги', () => {
      const book = { id: 1, status: 'wantToRead', readDate: null };
      const b2 = changeStatus([book], 1)[0];
      expect(b2.status).toBe('reading');

      const b3 = changeStatus([b2], 1)[0];
      expect(b3.status).toBe('read');
      expect(b3.readDate).not.toBeNull();

      const b4 = changeStatus([b3], 1)[0];
      expect(b4.status).toBe('wantToRead');
      expect(b4.readDate).toBeNull();
    });
  });

  describe('setRating()', () => {
    test('оновлює рейтинг лише потрібній книзі', () => {
      const books = [
        { id: 1, rating: 0 },
        { id: 2, rating: 3 }
      ];
      const updated = setRating(books, 2, 5);
      expect(updated.find(b => b.id === 2).rating).toBe(5);
      expect(updated.find(b => b.id === 1).rating).toBe(0);
    });
  });

  describe('updateGoal()', () => {
    test('оновлює ціль, якщо значення > 0', () => {
      expect(updateGoal(10, 15)).toBe(15);
    });

    test('не оновлює ціль, якщо значення <= 0', () => {
      expect(updateGoal(10, 0)).toBe(10);
      expect(updateGoal(10, -5)).toBe(10);
    });
  });
});
