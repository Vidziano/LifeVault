import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PersonalizedReminder from '../PersonalizedReminder';
import { waitFor } from '@testing-library/react';

beforeAll(() => {
    global.Notification = jest.fn().mockImplementation(() => ({
      close: jest.fn()
    }));
    global.Notification.permission = 'granted';
    global.Notification.requestPermission = jest.fn(() => Promise.resolve('granted'));
  });
  

jest.useFakeTimers();

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('notifications', 'true');
});

test('рендерить нагадування з повідомленням і gif', () => {
  render(<PersonalizedReminder />);
  act(() => {
    jest.advanceTimersByTime(5000);
    jest.runOnlyPendingTimers();
  });
  expect(screen.getByTestId('reminder-box')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src');
});

test('нагадування закривається при кліку ×', () => {
  render(<PersonalizedReminder />);
  act(() => {
    jest.advanceTimersByTime(5000);
    jest.runOnlyPendingTimers();
  });

  const closeButton = screen.getByText('×');
  fireEvent.click(closeButton);

  expect(screen.queryByTestId('reminder-box')).not.toBeInTheDocument();
});

test('не рендерить нагадування якщо notifications = false', () => {
  localStorage.setItem('notifications', 'false');
  render(<PersonalizedReminder />);
  act(() => {
    jest.advanceTimersByTime(5000);
    jest.runOnlyPendingTimers();
  });
  expect(screen.queryByTestId('reminder-box')).not.toBeInTheDocument();
});

test('нагадування зникає автоматично через duration', async () => {
    render(<PersonalizedReminder intervalMinutes={0.001} duration={3000} />);
  
    act(() => {
      jest.advanceTimersByTime(60); // зʼявлення
    });
  
    expect(screen.getByTestId('reminder-box')).toBeInTheDocument();
  
    act(() => {
      jest.advanceTimersByTime(3000); // зникнення
    });
  
    await waitFor(() => {
      expect(screen.queryByTestId('reminder-box')).not.toBeInTheDocument();
    });
  });
  
