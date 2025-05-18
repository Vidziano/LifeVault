// AchievementContext.logic.unit.test.js — юніт-тести для логіки досягнень
import { triggerAchievement, resetAchievements, defaultGif } from '../src/AchievementContext.logic';

describe('triggerAchievement()', () => {
  jest.useFakeTimers();

  test('встановлює повідомлення та гіфку', () => {
    const setMessage = jest.fn();
    const setGif = jest.fn();

    triggerAchievement('Ура!', 'https://test.gif', setMessage, setGif);

    expect(setMessage).toHaveBeenCalledWith('Ура!');
    expect(setGif).toHaveBeenCalledWith('https://test.gif');

    jest.advanceTimersByTime(7000);
    expect(setMessage).toHaveBeenLastCalledWith(null);
    expect(setGif).toHaveBeenLastCalledWith(null);
  });

  test('використовує defaultGif, якщо не передано gifUrl', () => {
    const setMessage = jest.fn();
    const setGif = jest.fn();

    triggerAchievement('Досягнення!', undefined, setMessage, setGif);

    expect(setGif).toHaveBeenCalledWith(defaultGif);
  });
});

describe('resetAchievements()', () => {
  test('очищає localStorage і викликає reload', () => {
    const removeItem = jest.fn();
    const reload = jest.fn();

    const mockWindow = {
      localStorage: { removeItem },
      location: { reload }
    };

    resetAchievements(mockWindow);

    expect(removeItem).toHaveBeenCalledWith('achievementsState');
    expect(removeItem).toHaveBeenCalledWith('achievementsProgress');
    expect(reload).toHaveBeenCalled();
  });
});
