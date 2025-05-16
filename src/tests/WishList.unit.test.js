// WishList.unit.test.js — юніт-тести для логіки компонента WishList
import { renderCategoryContent } from '../src/WishList.logic';


describe('WishList логіка — юніт-тести', () => {
  const mockSet = () => {};

  test('renderCategoryContent повертає відповідний компонент за ключем', () => {
    const components = ['travel', 'books', 'shopping', 'movies', 'dreams'];

    components.forEach((key) => {
      const result = renderCategoryContent(key, mockSet);
      expect(result.key).toBe(key);
    });
  });

  test('renderCategoryContent повертає null, якщо ключ невідомий', () => {
    const result = renderCategoryContent('невідомий', mockSet);
    expect(result).toBeNull();
  });
});

// Запуск тесту:
// npm test WishList.unit.test.js
