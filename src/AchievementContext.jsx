import React, { createContext, useState, useContext } from 'react';
import './Reminder.css';

const AchievementContext = createContext(null);

export const useAchievement = () => useContext(AchievementContext);

export function AchievementProvider({ children }) {
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupGif, setPopupGif] = useState(null);

  const achievementGif = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTN1eHRmc3l1cjh2eGdxdmh0ZmxjczZ4dzg0YzF1ZmlkMjBtc2dhdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BpDY6v9GyqLvS/giphy.gif';

  const triggerAchievement = (message, gifUrl) => {
    setPopupMessage(message);
    setPopupGif(gifUrl || defaultGif);
    setTimeout(() => {
      setPopupMessage(null);
      setPopupGif(null);
    }, 7000);
  };
  
  const defaultGif = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTN1eHRmc3l1cjh2eGdxdmh0ZmxjczZ4dzg0YzF1ZmlkMjBtc2dhdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BpDY6v9GyqLvS/giphy.gif';  

  const resetAchievements = () => {
    localStorage.removeItem('achievementsState');
    localStorage.removeItem('achievementsProgress');
    window.location.reload();
  };
  

  return (
    <AchievementContext.Provider value={{ triggerAchievement, resetAchievements }}>
      {children}

      {popupMessage && (
        <div className="reminder-toast">
          <img src={popupGif} alt="achievement" className="reminder-gif" />
          <p><strong>🏆 Досягнення розблоковано!</strong><br />{popupMessage}</p>
        </div>
      )}
    </AchievementContext.Provider>
  );
}
