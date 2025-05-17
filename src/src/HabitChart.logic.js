// HabitChart.logic.js — логіка для побудови даних графіку звичок

export const getProgressData = (habits, weekDates) => {
    if (!Array.isArray(habits) || !Array.isArray(weekDates)) return [];
  
    return habits.map((habit) => {
      const data = weekDates.map((date) => {
        const isCompleted = habit.completions.some(
          (c) => new Date(c).toDateString() === new Date(date).toDateString()
        );
        return isCompleted ? 1 : 0;
      });
  
      return {
        label: habit.name,
        data
      };
    });
  };
  