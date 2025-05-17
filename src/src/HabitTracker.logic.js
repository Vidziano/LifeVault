// HabitTracker.logic.js — логіка для прогресу звичок

export const calculateProgress = (habit, weekStart) => {
    if (!habit || !habit.completions || !Array.isArray(habit.completions)) return 0;
  
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date.toDateString();
    });
  
    const completedThisWeek = habit.completions.filter((d) =>
      weekDates.includes(new Date(d).toDateString())
    );
  
    return Math.round((completedThisWeek.length / 7) * 100);
  };
  