import React from 'react'; // <== було потрібно
import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('../TravelWishMap', () => {
  const MockGlobe = () => <div>Mock Globe</div>;
  MockGlobe.displayName = 'MockGlobe'; // для уникнення помилки eslint
  return MockGlobe;
});

test('рендерить App без помилок і показує головний інтерфейс', () => {
  render(<App />);
  const elements = screen.getAllByText(/Нотатки/i);
  expect(elements.length).toBeGreaterThan(0);
});
