// MoodTracker.logic.js — логіка для MoodTracker

export const getFilteredData = (history, mode, weekStart, month, year) => {
    if (!Array.isArray(history)) return [];
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
  
    return history.filter((entry) => {
      const date = new Date(entry.date);
      if (mode === 'week') {
        return date >= weekStart && date < weekEnd;
      } else if (mode === 'month') {
        return date.getFullYear() === year && date.getMonth() === month;
      }
      return true;
    });
  };
  
  export const getBestAndWorstDays = (filtered, mainEmojis) => {
    const scored = filtered.map((e) => {
      const score = mainEmojis.indexOf(e.mood);
      return { ...e, score };
    });
    if (!scored.length) return { best: null, worst: null };
    const sorted = [...scored].sort((a, b) => b.score - a.score);
    return { best: sorted[0], worst: sorted[sorted.length - 1] };
  };
  
  export const formatWeekLabel = (start) => {
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
  };
  
  export const handleExtraEmoji = (comment, emoji) => {
    return comment + emoji;
  };
  