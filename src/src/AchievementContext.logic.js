// AchievementContext.logic.js — виділена логіка для юніт-тестів

export const defaultGif = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTN1eHRmc3l1cjh2eGdxdmh0ZmxjczZ4dzg0YzF1ZmlkMjBtc2dhdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BpDY6v9GyqLvS/giphy.gif';

/**
 * Логіка досягнення: зберігає повідомлення і gif, очищає через 7 сек
 */
export function triggerAchievement(message, gifUrl, setPopupMessage, setPopupGif, setClearTimer = setTimeout) {
  setPopupMessage(message);
  setPopupGif(gifUrl || defaultGif);

  setClearTimer(() => {
    setPopupMessage(null);
    setPopupGif(null);
  }, 7000);
}

/**
 * Повністю очищає досягнення з localStorage і перезавантажує сторінку
 */
export function resetAchievements(globalScope = window) {
  globalScope.localStorage.removeItem('achievementsState');
  globalScope.localStorage.removeItem('achievementsProgress');
  globalScope.location.reload();
}
