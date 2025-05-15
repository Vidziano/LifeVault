import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import UserProfile from '../UserProfile';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('рендерить дані профілю в режимі перегляду', () => {
  render(<UserProfile />);
  const strongs = screen.getAllByText((_, el) => el.tagName === 'STRONG' && el.textContent.includes('Ім’я'));
  expect(strongs.length).toBeGreaterThan(0);
  expect(screen.getByText((_, el) => el.tagName === 'STRONG' && el.textContent.includes('Статус'))).toBeInTheDocument();
  expect(screen.getByRole('img')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /редагувати/i })).toBeInTheDocument();
});

test('перемикає в режим редагування', () => {
  render(<UserProfile />);
  fireEvent.click(screen.getByRole('button', { name: /редагувати/i }));
  expect(screen.getByLabelText('Ім’я:')).toBeInTheDocument();
});

test('змінює імʼя користувача', () => {
  render(<UserProfile />);
  fireEvent.click(screen.getByRole('button', { name: /редагувати/i }));
  const nameInput = screen.getByLabelText('Ім’я:');
  fireEvent.change(nameInput, { target: { value: 'Тестовий' } });
  expect(nameInput.value).toBe('Тестовий');
});

test('вибирає аватар із шаблонів', () => {
  render(<UserProfile />);
  fireEvent.click(screen.getByRole('button', { name: /редагувати/i }));
  const avatars = screen.getAllByRole('img');
  fireEvent.click(avatars[1]);
  expect(avatars[1].classList.contains('selected')).toBe(true);
});

test('вмикає і вимикає сповіщення', () => {
  render(<UserProfile />);
  fireEvent.click(screen.getByRole('button', { name: /редагувати/i }));
  const toggle = screen.getByRole('checkbox');
  expect(toggle.checked).toBe(true);
  fireEvent.click(toggle);
  expect(toggle.checked).toBe(false);
});

test('зберігає зміни і повертає у режим перегляду', () => {
  render(<UserProfile />);
  fireEvent.click(screen.getByRole('button', { name: /редагувати/i }));
  const nameInput = screen.getByLabelText('Ім’я:');
  fireEvent.change(nameInput, { target: { value: 'Новий юзер' } });
  fireEvent.click(screen.getByText('💾 Зберегти'));
  expect(screen.getByText(/новий юзер/i)).toBeInTheDocument();
});

test('завантажує аватар через файл', async () => {
  const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
  const readAsDataURL = jest.fn();
  const addEventListener = jest.fn((_, cb) => cb());
  const mockResult = 'data:image/png;base64,testimage';

  window.FileReader = jest.fn(() => ({
    readAsDataURL,
    addEventListener,
    result: mockResult,
    onload: null,
    readAsText: jest.fn()
  }));

  render(<UserProfile />);
  fireEvent.click(screen.getByRole('button', { name: /редагувати/i }));
  const input = screen.getByLabelText(/обрати файл/i);

  await act(async () => {
    fireEvent.change(input, { target: { files: [file] } });
  });

  expect(readAsDataURL).toHaveBeenCalledWith(file);
});

test('зберігає дані в localStorage', () => {
  render(<UserProfile />);
  fireEvent.click(screen.getByRole('button', { name: /редагувати/i }));
  const nameInput = screen.getByLabelText('Ім’я:');
  fireEvent.change(nameInput, { target: { value: 'Локальний' } });
  fireEvent.click(screen.getByText('💾 Зберегти'));

  const stored = JSON.parse(localStorage.getItem('userProfile'));
  expect(stored.name).toBe('Локальний');
});
