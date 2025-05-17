// achievementCheck.logic.js — перевірка та запуск досягнень

export const getNewlyCompletedAchievements = (achievementsList, triggered) => {
    if (!Array.isArray(achievementsList)) return [];
  
    return achievementsList.filter((a) => {
      return a.done && !triggered.includes(a.text);
    });
  };
  
  export const shouldTriggerAchievement = (achievement, triggered) => {
    return achievement.done && !triggered.includes(achievement.text);
  };
  