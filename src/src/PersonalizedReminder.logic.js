// PersonalizedReminder.logic.js — логіка, винесена з компонента

export const getRandomIndex = (length) => {
    if (!length || length <= 0) return 0;
    return Math.floor(Math.random() * length);
  };
  
  export const getReminderFromIndex = (reminders, index) => {
    if (!Array.isArray(reminders) || reminders.length === 0) return null;
    return reminders[index % reminders.length];
  };
  
  export const shouldShowReminder = (notificationsEnabled) => {
    return notificationsEnabled === true;
  };
  