// QuickNotesWidget.unit.test.js — юніт-тести для логіки нотаток
import { getFavoriteNotes } from '../src/QuickNotesWidget.logic';

describe('getFavoriteNotes — юніт-тести', () => {
  test('фільтрує лише нотатки з favorite: true', () => {
    const notes = [
      { id: 1, text: 'A', favorite: true },
      { id: 2, text: 'B', favorite: false },
      { id: 3, text: 'C', favorite: true }
    ];

    const result = getFavoriteNotes(notes);
    expect(result).toHaveLength(2);
    expect(result.map(n => n.id)).toEqual([1, 3]);
  });

  test('повертає пустий масив, якщо нічого не позначено', () => {
    const notes = [
      { id: 1, favorite: false },
      { id: 2 }
    ];
    expect(getFavoriteNotes(notes)).toEqual([]);
  });

  test('повертає пустий масив, якщо список порожній', () => {
    expect(getFavoriteNotes([])).toEqual([]);
  });
});

// Запуск тесту:
// npm test QuickNotesWidget.unit.test.js
