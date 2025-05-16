// MoviesWishList.logic.js

export function addMovie(saved, movie) {
    if (saved.find(m => m.id === movie.id)) return saved;
    return [...saved, { ...movie, status: 'wantToWatch', note: '', rating: 0 }];
  }
  
  export function removeMovie(saved, id) {
    return saved.filter(m => m.id !== id);
  }
  
  export function changeStatus(saved, id) {
    return saved.map(movie => {
      if (movie.id !== id) return movie;
      const next =
        movie.status === 'wantToWatch'
          ? 'watching'
          : movie.status === 'watching'
          ? 'watched'
          : 'wantToWatch';
      return {
        ...movie,
        status: next,
      };
    });
  }
  
  export function changeNote(saved, id, note) {
    return saved.map(m => (m.id === id ? { ...m, note } : m));
  }
  
  export function setRating(saved, id, rating) {
    return saved.map(m => (m.id === id ? { ...m, rating } : m));
  }
  
  export function getBadge(count) {
    if (count >= 100) return '🏆🎬 Абсолютний кіногуру!';
    if (count >= 75) return '🌟📽️ Кіно-легенда всіх часів!';
    if (count >= 50) return '💎🎞️ Майстер кінематографа!';
    if (count >= 35) return '🎬🧠 Ерудит екрану';
    if (count >= 25) return '🍿🔥 Кіноентузіаст у дії!';
    if (count >= 20) return '🏅🎬 Кіно-легенда!';
    if (count >= 15) return '🎯🎥 Влучний глядач';
    if (count >= 10) return '🏆 Справжній кіноман!';
    if (count >= 7) return '🍿 Почесний переглядач';
    if (count >= 5) return '🎉 Перший рекорд!';
    if (count >= 3) return '📼 Новачок з прогресом';
    if (count >= 1) return '🎞️ Перший перегляд';
    return null;
  }
  
  export function countWatched(saved) {
    return saved.filter(m => m.status === 'watched').length;
  }
  
  export function updateGoal(current, newGoal) {
    return newGoal > 0 ? newGoal : current;
  }
  