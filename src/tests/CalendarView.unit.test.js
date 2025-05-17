// CalendarView.unit.test.js — юніт-тести для логіки календаря
import {
    addEvent,
    addTask,
    toggleTask,
    deleteEvent,
    deleteTask,
    handleEditChange,
    handleTransfer
  } from '../src/CalendarView.logic';
  
  describe('CalendarView.logic — юніт-тести', () => {
    const today = new Date('2024-01-10');
    const yesterday = new Date('2024-01-09');
    const d = today.toDateString();
    const y = yesterday.toDateString();
  
    beforeEach(() => {
      localStorage.clear();
      jest.spyOn(Storage.prototype, 'setItem');
    });
  
    test('addEvent додає подію', () => {
      const result = addEvent({}, today, 'Мітинг', 'робота');
      expect(result[d][0]).toEqual({ text: 'Мітинг', theme: 'робота' });
    });
  
    test('addTask додає завдання', () => {
      const result = addTask({}, today, 'Купити хліб');
      expect(result[d][0]).toEqual({ text: 'Купити хліб', done: false });
    });
  
    test('toggleTask перемикає статус done', () => {
      const initial = { [d]: [{ text: 'Задача', done: false }] };
      const result = toggleTask(initial, today, 0);
      expect(result[d][0].done).toBe(true);
    });
  
    test('deleteEvent видаляє подію за індексом', () => {
      const events = { [d]: [{ text: 'Один', theme: '1' }, { text: 'Два', theme: '2' }] };
      const result = deleteEvent(events, today, 0);
      expect(result[d][0].text).toBe('Два');
    });
  
    test('deleteTask видаляє задачу за індексом', () => {
      const tasks = { [d]: [{ text: 'Один' }, { text: 'Два' }] };
      const result = deleteTask(tasks, today, 1);
      expect(result[d][0].text).toBe('Один');
    });
  
    test('handleEditChange змінює текст', () => {
      const obj = { [d]: [{ text: 'старий' }] };
      const result = handleEditChange(obj, today, 0, 'новий');
      expect(result[d][0].text).toBe('новий');
    });
  
    test('handleTransfer переносить незавершені задачі з учора', () => {
      const tasks = {
        [y]: [
          { text: '1', done: false },
          { text: '2', done: true }
        ],
        [d]: [{ text: 'вже є', done: false }]
      };
      const result = handleTransfer(tasks, today);
      expect(result[d].map((t) => t.text)).toContain('1');
      expect(result[y].length).toBe(1); // лише виконане залишилось
    });
  });
  