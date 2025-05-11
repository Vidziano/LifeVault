import React, { useEffect, useState } from 'react';
import './Achievements.css';
import { useAchievement } from './AchievementContext';

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const { resetAchievements } = useAchievement();

  useEffect(() => {
    updateAchievements();
  }, []);

  const updateAchievements = () => {
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

    const totalWishes = Object.values(wishlist).flat().length;
    const totalEvents = Object.values(calendarEvents).flat().length;
    const moodDays = moodHistory.length;
    const completedHabits7 = habits.filter(habit => Object.values(habit.log || {}).filter(Boolean).length >= 7).length;
    const completedHabits21 = habits.filter(habit => Object.values(habit.log || {}).filter(Boolean).length >= 21).length;
    const readBooks = books.filter(b => b.status === 'read').length;
    const watchedMovies = movies.filter(m => m.status === 'watched').length;
    const completedDreams = dreams.filter(d => d.completed).length;
    const visitedCountries = JSON.parse(localStorage.getItem('visitedCountries')) || [];

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

    localStorage.setItem('achievementsState', JSON.stringify(achievementsList));
    setAchievements(achievementsList);
  };

  const storedProgress = JSON.parse(localStorage.getItem('achievementsProgress')) || {};
  const total = achievements.length;
  const completed = achievements.filter(a => storedProgress[a.text]).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="achievements-wrapper">
      <h2>🏆 Нагороди</h2>

      <button className="reset-button" onClick={resetAchievements}>🔄 Скинути прогрес</button>

      <div className="progress-summary">
        Прогрес: {completed}/{total} ({progress}%)
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <ul className="achievements-list">
        {achievements.map((achieve, idx) => {
          const done = storedProgress[achieve.text];
          const individualProgress = Math.min(Math.round((achieve.current / achieve.goal) * 100), 100);

          return (
            <li key={idx} className={`${done ? 'achieved animate' : 'locked'}`}>
              <div className="achievement-text">{achieve.text}</div>
              <div className="achievement-progress">
                {achieve.current}/{achieve.goal} ({individualProgress}%)
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Achievements;
