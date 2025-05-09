import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dreams from '../Dreams';

// Моки візуальних компонентів, які не потрібні в юніт-тестах
jest.mock('../DreamChart', () => () => <div data-testid="chart-placeholder" />);
jest.mock('../DreamReflections', () => () => <div data-testid="reflections-placeholder" />);
jest.mock('../DreamDetails', () => () => <div data-testid="details-placeholder" />);

// Заглушка scrollIntoView для jsdom
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {};
});

// Очищення localStorage перед кожним тестом
beforeEach(() => {
  localStorage.clear();
});

test('додає мрію з усіма полями', async () => {
  render(<Dreams />);

  fireEvent.change(screen.getByPlaceholderText('Назва мрії'), {
    target: { value: 'Моя мрія' }
  });

  fireEvent.change(screen.getByPlaceholderText('План дій'), {
    target: { value: 'Досягти мети' }
  });

  fireEvent.change(screen.getByPlaceholderText('Крок 1'), {
    target: { value: 'Розпочати' }
  });

  fireEvent.change(screen.getByPlaceholderText('Чому ця мрія важлива?'), {
    target: { value: 'Бо це моя ціль' }
  });

  fireEvent.click(screen.getByText('💫 Додати мрію'));

  expect(await screen.findByText('Моя мрія')).toBeInTheDocument();
});

test('не додає мрію без жодного кроку', () => {
  render(<Dreams />);
  fireEvent.click(screen.getByText('💫 Додати мрію'));
  expect(screen.getByText(/⚠️ Додай хоча б один крок/i)).toBeInTheDocument();
});

test('редагує мрію і зберігає зміни', async () => {
  const mockDream = [{
    id: 1,
    title: 'Стара мрія',
    sphere: 'особисте',
    plan: 'План',
    steps: ['Крок 1'],
    completed: false,
    story: '',
    futureVision: '',
    reason: '',
    pinned: false,
    favorite: false,
    created: new Date().toLocaleString()
  }];
  localStorage.setItem('dreams', JSON.stringify(mockDream));

  render(<Dreams />);

  expect(await screen.findByText('Стара мрія')).toBeInTheDocument();

  const editButton = screen.getAllByText('✏️')[0];
  fireEvent.click(editButton);

  const titleInput = await screen.findByDisplayValue('Стара мрія');
  fireEvent.change(titleInput, { target: { value: 'Оновлена мрія' } });

  fireEvent.click(screen.getByText('✏️ Зберегти зміни'));

  expect(await screen.findByText('Оновлена мрія')).toBeInTheDocument();

  const saved = JSON.parse(localStorage.getItem('dreams'));
  console.log('🧪 Saved dreams in LS:', saved);
  expect(saved[0].title).toBe('Оновлена мрія');
});

test('видаляє мрію', async () => {
  const mockDream = [{
    id: 2,
    title: 'Мрія для видалення',
    sphere: 'кар’єра',
    plan: '',
    steps: [''],
    completed: false,
    story: '',
    futureVision: '',
    reason: '',
    pinned: false,
    favorite: false,
    created: new Date().toLocaleString()
  }];
  localStorage.setItem('dreams', JSON.stringify(mockDream));

  render(<Dreams />);

  fireEvent.click(await screen.findByText('🗑️'));

  await waitFor(() => {
    expect(screen.queryByText('Мрія для видалення')).not.toBeInTheDocument();
  });
});
