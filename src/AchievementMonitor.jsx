// src/AchievementMonitor.jsx
import { useEffect } from 'react';

import { useAchievement } from './AchievementContext';

const achievementGifs = {
  '📓 Створити 1 нотатку': 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWhqZGM5c2lmaGZ1bWxmNTRnc3BrendiY2cxc2Nzcm94aDdscm9pbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1aPuY0iblEJupNGrWL/giphy.gif',
  '📓 Створити 5 нотаток': 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnVqeTJjdnV0MTF4anlhYjY5b2o0N3Vsa2N4NnpkdXI1MXM4OGtrbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VbnUQpnihPSIgIXuZv/giphy.gif',
  '📓 Створити 10 нотаток': 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXRkdjB5NDBjOGtuMHhodDNhd2M3NnlydWwyN3Y1ZjMwd2ZrdHF1cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JIX9t2j0ZTN9S/giphy.gif',
  '📓 Створити 50 нотаток': 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDNoc2VuaHRwMGphOHJubTdnazA3NjhseWdteWswdHdtYWtiZDAxMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/q6RoNkLlFNjaw/giphy.gif',
  '📅 Створити 1 подію': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnlwbnVwbWI4ejlrNWhpZDJnNnE0aW16eXB4bzNjc2o5eHY1MjJ3ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Dmvw3HJNNrch9M3hh3/giphy.gif',
  '📅 Створити 10 подій': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGltbHJsdml5YjZyZ2N2ZzF4bGM5ZWlpZ2VoNDIwczVmZGl2aGY0ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ckNIUROAf7Coeq3uBU/giphy.gif',
  '🎯 Виконати звичку 1 день': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHVkenlmeXFrYm0xbWliN3E5N3l2OXk3amhyYXBiOXg2YmF2ZjNwNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZidtAlFZdjS8S6ZFdj/giphy.gif',
  '🎯 Виконати звичку 7 днів': 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdG0yM296Y29uMXd5aGg1cjRycnhndjRhNTdrcnk5cjhtazhmNzI2YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6EhLOY6YRdS7ttgA/giphy.gif',
  '🎯 Виконати звичку 21 день': 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDhncmtpZmp4ZjE5aGUxdXBjNG05eXR1bnRnaGp4cXFndW5tM3dxaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l378mDT0AhDEo7PMc/giphy.gif',
  '🌈 Заповнити настрій 7 днів': 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2w0enJiODV0MmZlbDNlOHM4NWFyMXhkZmM1ZXRuN2Q3cWo5N2YzbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/69lVo8KuIgeh4MsMQQ/giphy.gif',
  '🌈 Заповнити настрій 21 день': 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExenFhbjYyYXlpbjIwZGtsbWFkOGxkY3g2OHk5YWhkaGNtdjZyeG5vMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cmr86hIAx8q7aqM4mm/giphy.gif',
  '🌈 Заповнити настрій 50 днів': ' https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2F4ZzR2b2hieXl5Zzg1Y3A1azJzMHh6c2N0dXN3aGZkZWgwcjNhMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zw69pUViBZCZW/giphy.gif',
  '🌟 Додати перший малюнок на дошку натхнення': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2w3dXhybnprdnJ4aXhjNmhkYzE5M21ieGRkOWhwY2lvb29rc2JhbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HWLa2UnmEsc2qpYu8f/giphy.gif',
  '📚 Прочитати 5 книг': 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGZ6NGNzenN4NDB1bGZ3a2tqbXdreHRzaG1qa3BkZ3BlM2thMmNtbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dUsblht9Hs4abHk8aG/giphy.gif',
  '🎬 Переглянути 5 фільмів': 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExams1c3RpZ3Vrcm43MW5rMzIzcW84emZ0ZzJnMTJxMDh2ZDgxaWZzZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7rc0qU6m5hneMsuc/giphy.gif',
  '🌈 Зберегти 5 мудбордів': 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTBoMXR0MzhrbzJvejByMnk4eWNqbDd0cDY0ZzUxdW8xeG05b3NkMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XQiJigZpYQ9dKrrEbv/giphy.gif',
  '🌈 Зберегти 10 мудбордів': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHowam96NHExcHVocnJydnJ1aXN6dmhkbmw3dHk3YnV6MGlxeDdveiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fmgzNi0Iv5mDo54iGO/giphy.gif',
  '🌍 Відвідати 1 країну': 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHpsOWQ0bDh0azE1OWRuaGFrcWttZ2xsN254ZGVpbm92MHgwdjEycyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/m1wjvswTOQJ06HU7xu/giphy.gif',
  '🌍 Відвідати 5 країн': 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjU5NmNxN2lrMjZtOXljYTF0eXJlaWU3ODZhNWZuYWJ4bHJkZDNkOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/uY4CJ1kPx3gxpn9HD5/giphy.gif',
  '🌍 Відвідати 10 країн': 'https://i.giphy.com/lXC2gmHf2ypUs.webp',
  '✅ Виконати 1 мрію': 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzF2N2xpcHliZnN5bjN0YTZmNGhwY245cDRueW5sdml6dzF6NDNmaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3orifgZ0nDCRjK6tJm/giphy.gif',
  '✅ Виконати 5 мрій': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDhucHd4dHVzdTZ4aDJoYTJpZGhvcHE3dzZkZ2Z0cHAzYWF0MHFqOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1MTLxzwvOnvmE/giphy.gif',
  '✅ Виконати 10 мрій': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjE4eHM4czMybnBmbzA0ODFxeWN0Y2VmdTFzNm1sNHpzdWk1djBoZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DYH297XiCS2Ck/giphy.gif',
  '🛒 Додати 10 бажань у список покупок': 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWJzdGU3aTdqMnI3NHMyMG5nNjhtZGxkdG8xNGM4aWFjYmNqdTI3dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Xz4YOcEBaCdJKHz0I4/giphy.gif',
  '🛒 Додати 25 бажань у список покупок': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXR2YTE3OWttbXQ2b2ZjMWc0NXV6ZmMxYjNzMnRtYzlpNzEwdmtoMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HfGomEn75GwUv105Gv/giphy.gif',
  '🛒 Додати 50 бажань у список покупок': 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzV2cXVmM3NuNWo3aGIzZWh3dWRwbzQ1NTNvc2wwZ3d5bXYyZHZzMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s8Sh7b9lB2TOocCFqu/giphy.gif'
};

function AchievementMonitor() {
  const { triggerAchievement } = useAchievement();

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents')) || {};
        const books = JSON.parse(localStorage.getItem('savedBooks')) || [];
        const movies = JSON.parse(localStorage.getItem('savedMovies')) || [];
        const dreams = JSON.parse(localStorage.getItem('dreams')) || [];
        const shopping = JSON.parse(localStorage.getItem('shoppingList')) || [];
        const inspoBoards = JSON.parse(localStorage.getItem('inspo-savedItems')) || [];
        const visitedCountries = JSON.parse(localStorage.getItem('visitedCountries')) || [];

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
