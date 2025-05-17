// MotivationalQuote.logic.js — логіка цитат

export const getInitialQuote = (quotes) => {
    if (!Array.isArray(quotes) || quotes.length === 0) return '';
    const dateSeed = new Date().getDate() % quotes.length;
    return quotes[dateSeed];
  };
  
  export const getNewRandomQuote = (quotes, current) => {
    if (!Array.isArray(quotes) || quotes.length <= 1) return current;
  
    const filtered = quotes.filter((q) => q !== current);
    const index = Math.floor(Math.random() * filtered.length);
    return filtered[index];
  };
  