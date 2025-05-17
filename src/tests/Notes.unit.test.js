// Notes.unit.test.js — юніт-тести для логіки Notes
import {
    saveNotes,
    handleSaveNote,
    deleteNote,
    togglePin,
    toggleFavorite
  } from '../src/Notes.logic';
  
  describe('Notes.logic — юніт-тести', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.spyOn(Storage.prototype, 'setItem');
    });
  
    test('handleSaveNote додає нову нотатку', () => {
      const notes = [];
      const newNote = { id: '1', text: 'Test' };
      const updated = handleSaveNote(notes, newNote);
  
      expect(updated).toHaveLength(1);
      expect(updated[0].text).toBe('Test');
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  
    test('handleSaveNote оновлює наявну нотатку', () => {
      const notes = [{ id: '1', text: 'Old' }];
      const note = { id: '1', text: 'New' };
      const updated = handleSaveNote(notes, note);
  
      expect(updated).toHaveLength(1);
      expect(updated[0].text).toBe('New');
    });
  
    test('deleteNote видаляє нотатку за id', () => {
      const notes = [{ id: '1' }, { id: '2' }];
      const updated = deleteNote(notes, '1');
      expect(updated).toHaveLength(1);
      expect(updated[0].id).toBe('2');
    });
  
    test('togglePin перемикає pinned стан', () => {
      const notes = [{ id: '1', pinned: false }];
      const updated = togglePin(notes, '1');
      expect(updated[0].pinned).toBe(true);
    });
  
    test('toggleFavorite перемикає favorite стан', () => {
      const notes = [{ id: '1', favorite: true }];
      const updated = toggleFavorite(notes, '1');
      expect(updated[0].favorite).toBe(false);
    });
  });
  
  // Запуск:
  // npm test Notes.unit.test.js
  