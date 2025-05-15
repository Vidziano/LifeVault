import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteModal from '../NoteModal';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

beforeEach(() => {
  mockOnClose.mockClear();
  mockOnSave.mockClear();
});

test('не відображає модалку, якщо isOpen = false', () => {
  render(<NoteModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />);
  expect(screen.queryByText(/Нова нотатка|Редагувати нотатку/)).not.toBeInTheDocument();
});

test('створення нотатки — вводяться заголовок, текст і категорія', () => {
  render(<NoteModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

  fireEvent.change(screen.getByPlaceholderText('Назва нотатки'), {
    target: { value: 'Test Title' },
  });
  fireEvent.change(screen.getByPlaceholderText('Текст нотатки...'), {
    target: { value: 'Test content' },
  });
  fireEvent.change(screen.getByDisplayValue('особисте'), {
    target: { value: 'робота' },
  });

  fireEvent.click(screen.getByText('Зберегти'));

  expect(mockOnSave).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'Test Title',
      text: 'Test content',
      category: 'робота',
    })
  );
  expect(mockOnClose).toHaveBeenCalled();
});

test('відображає попередній перегляд зображення при виборі файлу', async () => {
  render(<NoteModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

  const file = new File(['dummy'], 'example.png', { type: 'image/png' });
  const fileInput = screen.getByLabelText('📎');

  fireEvent.change(fileInput, { target: { files: [file] } });

  await waitFor(() => {
    expect(screen.getByAltText('attached')).toBeInTheDocument();
  });
});

test('кнопка "×" видаляє зображення', async () => {
  render(<NoteModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} existingNote={{ fileUrl: 'test.png' }} />);

  expect(screen.getByAltText('attached')).toBeInTheDocument();

  const removeBtn = screen.getByRole('button', { name: '×' });
  fireEvent.click(removeBtn);

  await waitFor(() => {
    expect(screen.queryByAltText('attached')).not.toBeInTheDocument();
  });
});

test('не викликає onSave, якщо пусті заголовок і текст', () => {
  render(<NoteModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
  fireEvent.click(screen.getByText('Зберегти'));
  expect(mockOnSave).not.toHaveBeenCalled();
});
