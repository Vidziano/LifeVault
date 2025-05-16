// AchievementContext.unit.test.js
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AchievementProvider, useAchievement } from '../AchievementContext';

const TestComponent = () => {
  const { triggerAchievement, resetAchievements } = useAchievement();

  return (
    <>
      <button onClick={() => triggerAchievement('Тест досягнення', 'https://gif.test/test.gif')}>Trigger</button>
      <button onClick={resetAchievements}>Reset</button>
    </>
  );
};

describe('AchievementContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
    window.localStorage.__proto__.removeItem = jest.fn();
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('triggerAchievement відображає тост і очищається', () => {
    render(
      <AchievementProvider>
        <TestComponent />
      </AchievementProvider>
    );

    act(() => {
      screen.getByText('Trigger').click();
    });

    expect(screen.getByText('Тест досягнення')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(7000);
    });
    expect(screen.queryByText('Тест досягнення')).toBeNull();
  });

  test('resetAchievements очищає localStorage і викликає reload', () => {
    render(
      <AchievementProvider>
        <TestComponent />
      </AchievementProvider>
    );

    act(() => {
      screen.getByText('Reset').click();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('achievementsState');
    expect(localStorage.removeItem).toHaveBeenCalledWith('achievementsProgress');
    expect(window.location.reload).toHaveBeenCalled();
  });
});