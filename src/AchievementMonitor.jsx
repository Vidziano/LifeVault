// src/AchievementMonitor.jsx
import React, { useEffect } from 'react';
import { useAchievement } from './AchievementContext';

const achievementGifs = {
  '📓 Створити 1 нотатку': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  '📓 Створити 5 нотаток': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
  '📓 Створити 10 нотаток': 'https://media.giphy.com/media/l0HlSNOxJB956qwfK/giphy.gif',
  '📓 Створити 50 нотаток': 'https://media.giphy.com/media/13borq7Zo2kulO/giphy.gif',
  '📅 Створити 1 подію': 'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
  '📅 Створити 10 подій': 'https://media.giphy.com/media/13borq7Zo2kulO/giphy.gif',
  '🎯 Виконати звичку 1 день': 'https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif',
  '🎯 Виконати звичку 7 днів': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  '🎯 Виконати звичку 21 день': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
  '🌈 Заповнити настрій 7 днів': 'https://media.giphy.com/media/3o6ZsYiRFz6rIujfSU/giphy.gif',
  '🌈 Заповнити настрій 21 день': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
  '🌈 Заповнити настрій 50 днів': 'https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif',
  '🌟 Додати перший малюнок на дошку натхнення': 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
  '📚 Прочитати 5 книг': 'https://media.giphy.com/media/xT1XGNz0UOf5M0lC0M/giphy.gif',
  '🎬 Переглянути 5 фільмів': 'https://media.giphy.com/media/xT9IgpXy5Cqf1e2TSY/giphy.gif',
  '🌈 Зберегти 1 мудборд': 'https://media.giphy.com/media/3o7qE1YN7aBOFPRw8E/giphy.gif',
  '🌈 Зберегти 5 мудбордів': 'https://media.giphy.com/media/l3V0j3ytFyGHqiV7W/giphy.gif',
  '🌈 Зберегти 10 мудбордів': 'https://media.giphy.com/media/xUPGcEOt3i8Rk7kZ6w/giphy.gif',
  '🌍 Відвідати 1 країну': 'https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif',
  '🌍 Відвідати 5 країн': 'https://media.giphy.com/media/3oz8xKaR836UJOYeOc/giphy.gif',
  '🌍 Відвідати 10 країн': 'https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif',
  '✅ Виконати 1 мрію': 'https://media.giphy.com/media/1n4vZh4X2YmM6/giphy.gif',
  '✅ Виконати 5 мрій': 'https://media.giphy.com/media/26xBwdIuRJiAiWith/giphy.gif',
  '✅ Виконати 10 мрій': 'https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif',
  '🛒 Додати 10 бажань у список покупок': 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif',
  '🛒 Додати 25 бажань у список покупок': 'https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif',
  '🛒 Додати 50 бажань у список покупок': 'https://media.giphy.com/media/xT9DPPqwoc4rs3kOUE/giphy.gif'
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
        const books = JSON.parse(localStorage.getItem('savedBooks')) || [];
        const movies = JSON.parse(localStorage.getItem('savedMovies')) || [];
        const dreams = JSON.parse(localStorage.getItem('dreams')) || [];
        const shopping = JSON.parse(localStorage.getItem('shoppingList')) || [];
        const inspoBoards = JSON.parse(localStorage.getItem('inspo-savedItems')) || [];
        const visitedCountries = JSON.parse(localStorage.getItem('visitedCountries')) || [];

        const totalWishes = Object.values(wishlist).flat().length;
        const totalEvents = Object.values(calendarEvents).flat().length;
        const moodDays = moodHistory.length;
        const completedHabits7 = habits.filter(habit => Object.values(habit.log || {}).filter(Boolean).length >= 7).length;
        const completedHabits21 = habits.filter(habit => Object.values(habit.log || {}).filter(Boolean).length >= 21).length;
        const readBooks = books.filter(b => b.status === 'read').length;
        const watchedMovies = movies.filter(m => m.status === 'watched').length;
        const completedDreams = dreams.filter(d => d.completed).length;

        const achievementsList = [
          { text: '📓 Створити 1 нотатку', current: notes.length, goal: 1 },
          { text: '📓 Створити 5 нотаток', current: notes.length, goal: 5 },
          { text: '📓 Створити 10 нотаток', current: notes.length, goal: 10 },
          { text: '📓 Створити 50 нотаток', current: notes.length, goal: 50 },
          { text: '📅 Створити 1 подію', current: totalEvents, goal: 1 },
          { text: '📅 Створити 10 подій', current: totalEvents, goal: 10 },
          { text: '🎯 Виконати звичку 1 день', current: habits.some(habit => Object.values(habit.log || {}).some(v => v)) ? 1 : 0, goal: 1 },
          { text: '🎯 Виконати звичку 7 днів', current: completedHabits7, goal: 1 },
          { text: '🎯 Виконати звичку 21 день', current: completedHabits21, goal: 1 },
          { text: '🌈 Заповнити настрій 7 днів', current: moodDays, goal: 7 },
          { text: '🌈 Заповнити настрій 21 день', current: moodDays, goal: 21 },
          { text: '🌈 Заповнити настрій 50 днів', current: moodDays, goal: 50 },
          { text: '🌟 Додати перший малюнок на дошку натхнення', current: inspoBoards.length >= 1 ? 1 : 0, goal: 1 },
          { text: '📚 Прочитати 5 книг', current: readBooks, goal: 5 },
          { text: '🎬 Переглянути 5 фільмів', current: watchedMovies, goal: 5 },
          { text: '🌈 Зберегти 1 мудборд', current: inspoBoards.length, goal: 1 },
          { text: '🌈 Зберегти 5 мудбордів', current: inspoBoards.length, goal: 5 },
          { text: '🌈 Зберегти 10 мудбордів', current: inspoBoards.length, goal: 10 },
          { text: '🌍 Відвідати 1 країну', current: visitedCountries.length, goal: 1 },
          { text: '🌍 Відвідати 5 країн', current: visitedCountries.length, goal: 5 },
          { text: '🌍 Відвідати 10 країн', current: visitedCountries.length, goal: 10 },
          { text: '✅ Виконати 1 мрію', current: completedDreams, goal: 1 },
          { text: '✅ Виконати 5 мрій', current: completedDreams, goal: 5 },
          { text: '✅ Виконати 10 мрій', current: completedDreams, goal: 10 },
          { text: '🛒 Додати 10 бажань у список покупок', current: shopping.length, goal: 10 },
          { text: '🛒 Додати 25 бажань у список покупок', current: shopping.length, goal: 25 },
          { text: '🛒 Додати 50 бажань у список покупок', current: shopping.length, goal: 50 },
        ];

        const storedProgress = JSON.parse(localStorage.getItem('achievementsProgress')) || {};

        achievementsList.forEach((a) => {
          const isAlreadyCompleted = storedProgress[a.text];
          const nowDone = a.current >= a.goal;

          if (!isAlreadyCompleted && nowDone) {
            const gifUrl = achievementGifs[a.text] || null;
            triggerAchievement(a.text, gifUrl);
            storedProgress[a.text] = true;
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

export default AchievementMonitor;
