// NoteModal.unit.test.js — юніт-тести для логіки NoteModal
import {
    isNoteValid,
    buildNoteFromInputs,
    handleRemoveImageLogic
  } from '../src/NoteModal.logic';
  
  describe('NoteModal.logic — юніт-тести', () => {
    describe('isNoteValid()', () => {
      test('повертає true для валідних тексту і категорії', () => {
        const note = { text: 'Привіт', category: 'особисте' };
        expect(isNoteValid(note)).toBe(true);
      });
  
      test('повертає false, якщо text порожній', () => {
        const note = { text: '   ', category: 'навчання' };
        expect(isNoteValid(note)).toBe(false);
      });
  
      test('повертає false, якщо category порожня', () => {
        const note = { text: 'Задача', category: ' ' };
        expect(isNoteValid(note)).toBe(false);
      });
    });
  
    describe('buildNoteFromInputs()', () => {
      test('повертає злитий обʼєкт з оновленою датою', () => {
        const inputs = { text: 'Новий', category: 'робота' };
        const editingNote = { id: '1', pinned: false };
        const result = buildNoteFromInputs(inputs, editingNote);
  
        expect(result.id).toBe('1');
        expect(result.text).toBe('Новий');
        expect(result.category).toBe('робота');
        expect(result.updated).toBeDefined();
      });
    });
  
    describe('handleRemoveImageLogic()', () => {
      test('очищає fileUrl і fileName', () => {
        const note = { fileUrl: 'image.png', fileName: 'image.png' };
        const result = handleRemoveImageLogic(note);
  
        expect(result.fileUrl).toBe('');
        expect(result.fileName).toBe('');
      });
    });
  });
  