// src/AchievementMonitor.jsx
import React, { useEffect } from 'react';
import { useAchievement } from './AchievementContext';

// Гіфки для кожної нагороди
const achievementGifs = {
  '📓 Створити 1 нотатку': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  '📓 Створити 5 нотаток': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
  '📓 Створити 10 нотаток': 'https://media.giphy.com/media/l0HlSNOxJB956qwfK/giphy.gif',
  '📓 Створити 50 нотаток': 'https://media.giphy.com/media/13borq7Zo2kulO/giphy.gif',
  
  '💖 Додати 1 бажання': 'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
  '💖 Додати 5 бажань': 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
  '💖 Додати 10 бажань': 'https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif',
  '💖 Додати 50 бажань': 'https://media.giphy.com/media/l0HlSNOxJB956qwfK/giphy.gif',
  
  '📅 Створити 1 подію': 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
  '📅 Створити 10 подій': 'https://media.giphy.com/media/13borq7Zo2kulO/giphy.gif',
  
  '🎯 Виконати звичку 1 день': 'https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif',
  '🎯 Виконати звичку 7 днів': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  '🎯 Виконати звичку 21 день': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
  
  '🌈 Заповнити настрій 7 днів': 'https://media.giphy.com/media/3o6ZsYiRFz6rIujfSU/giphy.gif',
  '🌈 Заповнити настрій 21 день': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
  '🌈 Заповнити настрій 50 днів': 'https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif',
  
  '🌟 Додати перший малюнок на дошку натхнення': 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
};

function AchievementMonitor() {
  const { triggerAchievement } = useAchievement();

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
        const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents')) || {};

        const totalWishes = Object.values(wishlist).flat().length;
        const totalEvents = Object.values(calendarEvents).flat().length;
        const moodDays = moodHistory.length;
        const completedHabits7 = habits.filter(habit => Object.values(habit.log || {}).filter(Boolean).length >= 7).length;
        const completedHabits21 = habits.filter(habit => Object.values(habit.log || {}).filter(Boolean).length >= 21).length;

        const achievementsList = [
          { text: '📓 Створити 1 нотатку', current: notes.length, goal: 1 },
          { text: '📓 Створити 5 нотаток', current: notes.length, goal: 5 },
          { text: '📓 Створити 10 нотаток', current: notes.length, goal: 10 },
          { text: '📓 Створити 50 нотаток', current: notes.length, goal: 50 },
          { text: '💖 Додати 1 бажання', current: totalWishes, goal: 1 },
          { text: '💖 Додати 5 бажань', current: totalWishes, goal: 5 },
          { text: '💖 Додати 10 бажань', current: totalWishes, goal: 10 },
          { text: '💖 Додати 50 бажань', current: totalWishes, goal: 50 },
          { text: '📅 Створити 1 подію', current: totalEvents, goal: 1 },
          { text: '📅 Створити 10 подій', current: totalEvents, goal: 10 },
          { text: '🎯 Виконати звичку 1 день', current: habits.some(habit => Object.values(habit.log || {}).some(v => v)) ? 1 : 0, goal: 1 },
          { text: '🎯 Виконати звичку 7 днів', current: completedHabits7, goal: 1 },
          { text: '🎯 Виконати звичку 21 день', current: completedHabits21, goal: 1 },
          { text: '🌈 Заповнити настрій 7 днів', current: moodDays, goal: 7 },
          { text: '🌈 Заповнити настрій 21 день', current: moodDays, goal: 21 },
          { text: '🌈 Заповнити настрій 50 днів', current: moodDays, goal: 50 },
          { text: '🌟 Додати перший малюнок на дошку натхнення', current: checkInspoBoard() ? 1 : 0, goal: 1 },
        ];

        const storedProgress = JSON.parse(localStorage.getItem('achievementsProgress')) || {};

        achievementsList.forEach((a) => {
          const isAlreadyCompleted = storedProgress[a.text];
          const nowDone = a.current >= a.goal;

          if (!isAlreadyCompleted && nowDone) {
            const gifUrl = achievementGifs[a.text] || null;
            triggerAchievement(a.text, gifUrl);
            storedProgress[a.text] = true; // Позначаємо, що нагорода отримана
          }
        });

        localStorage.setItem('achievementsProgress', JSON.stringify(storedProgress));
      } catch (error) {
        console.error('Помилка моніторингу досягнень:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [triggerAchievement]);

  return null;
}

const checkInspoBoard = () => {
  try {
    const savedBoards = JSON.parse(localStorage.getItem('savedInspoBoards')) || [];
    return savedBoards.length >= 1;
  } catch {
    return false;
  }
};

export default AchievementMonitor;
