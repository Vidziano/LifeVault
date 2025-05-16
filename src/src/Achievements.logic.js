// Achievements.logic.js

export function buildAchievementsList(data) {
    const {
      notes = [],
      habits = [],
      moodHistory = [],
      calendarEvents = {},
      savedBooks = [],
      savedMovies = [],
      dreams = [],
      shoppingList = [],
      inspo = [],
      visitedCountries = []
    } = data;
  
    const totalEvents = Object.values(calendarEvents).flat().length;
    const moodDays = moodHistory.length;
    const completedHabits7 = habits.filter(h => Object.values(h.log || {}).filter(Boolean).length >= 7).length;
    const completedHabits21 = habits.filter(h => Object.values(h.log || {}).filter(Boolean).length >= 21).length;
    const readBooks = savedBooks.filter(b => b.status === 'read').length;
    const watchedMovies = savedMovies.filter(m => m.status === 'watched').length;
    const completedDreams = dreams.filter(d => d.completed).length;
  
    return [
      { text: '📓 Створити 1 нотатку', current: notes.length, goal: 1 },
      { text: '📓 Створити 5 нотаток', current: notes.length, goal: 5 },
      { text: '📓 Створити 10 нотаток', current: notes.length, goal: 10 },
      { text: '📓 Створити 50 нотаток', current: notes.length, goal: 50 },
      { text: '📅 Створити 1 подію', current: totalEvents, goal: 1 },
      { text: '📅 Створити 10 подій', current: totalEvents, goal: 10 },
      { text: '🎯 Виконати звичку 1 день', current: habits.some(h => Object.values(h.log || {}).some(v => v)) ? 1 : 0, goal: 1 },
      { text: '🎯 Виконати звичку 7 днів', current: completedHabits7, goal: 1 },
      { text: '🎯 Виконати звичку 21 день', current: completedHabits21, goal: 1 },
      { text: '🌈 Заповнити настрій 7 днів', current: moodDays, goal: 7 },
      { text: '🌈 Заповнити настрій 21 день', current: moodDays, goal: 21 },
      { text: '🌈 Заповнити настрій 50 днів', current: moodDays, goal: 50 },
      { text: '🌟 Додати перший малюнок на дошку натхнення', current: inspo.length >= 1 ? 1 : 0, goal: 1 },
      { text: '📚 Прочитати 5 книг', current: readBooks, goal: 5 },
      { text: '🎬 Переглянути 5 фільмів', current: watchedMovies, goal: 5 },
      { text: '🌈 Зберегти 5 мудбордів', current: inspo.length, goal: 5 },
      { text: '🌈 Зберегти 10 мудбордів', current: inspo.length, goal: 10 },
      { text: '🌍 Відвідати 1 країну', current: visitedCountries.length, goal: 1 },
      { text: '🌍 Відвідати 5 країн', current: visitedCountries.length, goal: 5 },
      { text: '🌍 Відвідати 10 країн', current: visitedCountries.length, goal: 10 },
      { text: '✅ Виконати 1 мрію', current: completedDreams, goal: 1 },
      { text: '✅ Виконати 5 мрій', current: completedDreams, goal: 5 },
      { text: '✅ Виконати 10 мрій', current: completedDreams, goal: 10 },
      { text: '🛒 Додати 10 бажань у список покупок', current: shoppingList.length, goal: 10 },
      { text: '🛒 Додати 25 бажань у список покупок', current: shoppingList.length, goal: 25 },
      { text: '🛒 Додати 50 бажань у список покупок', current: shoppingList.length, goal: 50 },
    ];
  }
  
  export function getProgressSummary(achievements, storedProgress) {
    const total = achievements.length;
    const completed = achievements.filter(a => storedProgress[a.text]).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, progress };
  }
  
  export function getIndividualProgress(current, goal) {
    return Math.min(Math.round((current / goal) * 100), 100);
  }