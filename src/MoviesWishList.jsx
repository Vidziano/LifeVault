import React, { useState, useEffect } from 'react';
import './MoviesWishList.css';

function MoviesWishList() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [savedMovies, setSavedMovies] = useState(
    JSON.parse(localStorage.getItem('savedMovies')) || []
  );
  const [goal, setGoal] = useState(
    parseInt(localStorage.getItem('moviesGoal')) || 10
  );
  const [newGoal, setNewGoal] = useState(goal);

  const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OTFhMGZhMTBhZmM1MjExNWJkY2FlZmNiZjZlNDUxYiIsIm5iZiI6MTc0NjAzNzU2NS42Niwic3ViIjoiNjgxMjZiM2QwODVhZWI3NGVmOWIzNjQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.IKUpoSzfpBBORDnPvmHf2zEEvWnaJLgDw-el9ogE4wQ';

  useEffect(() => {
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
  }, [savedMovies]);

  useEffect(() => {
    localStorage.setItem('moviesGoal', goal);
  }, [goal]);

  const searchMovies = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      const data = await res.json();
      const mapped = data.results?.map(item => ({
        id: item.id,
        title: item.title,
        overview: item.overview || '',
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        imdbLink: item.id ? `https://www.themoviedb.org/movie/${item.id}` : ''
      })) || [];
      setResults(mapped);
    } catch (error) {
      console.error('Помилка під час запиту:', error);
    }
  };

  const addMovie = (movie) => {
    if (!savedMovies.find(m => m.id === movie.id)) {
      setSavedMovies(prev => [...prev, { ...movie, status: 'wantToWatch', note: '', rating: 0 }]);
    }
  };

  const removeMovie = (id) => {
    setSavedMovies(prev => prev.filter(movie => movie.id !== id));
  };

  const changeStatus = (id) => {
    setSavedMovies(prev =>
      prev.map(movie =>
        movie.id === id
          ? {
              ...movie,
              status:
                movie.status === 'wantToWatch'
                  ? 'watching'
                  : movie.status === 'watching'
                  ? 'watched'
                  : 'wantToWatch',
            }
          : movie
      )
    );
  };

  const changeNote = (id, note) => {
    setSavedMovies(prev =>
      prev.map(movie => (movie.id === id ? { ...movie, note } : movie))
    );
  };

  const setRating = (id, rating) => {
    setSavedMovies(prev =>
      prev.map(movie =>
        movie.id === id ? { ...movie, rating } : movie
      )
    );
  };

  const watchedCount = savedMovies.filter(m => m.status === 'watched').length;

  const getBadge = () => {
    if (watchedCount >= 100) return '🏆🎬 Абсолютний кіногуру!';
    if (watchedCount >= 75) return '🌟📽️ Кіно-легенда всіх часів!';
    if (watchedCount >= 50) return '💎🎞️ Майстер кінематографа!';
    if (watchedCount >= 35) return '🎬🧠 Ерудит екрану';
    if (watchedCount >= 25) return '🍿🔥 Кіноентузіаст у дії!';
    if (watchedCount >= 20) return '🏅🎬 Кіно-легенда!';
    if (watchedCount >= 15) return '🎯🎥 Влучний глядач';
    if (watchedCount >= 10) return '🏆 Справжній кіноман!';
    if (watchedCount >= 7) return '🍿 Почесний переглядач';
    if (watchedCount >= 5) return '🎉 Перший рекорд!';
    if (watchedCount >= 3) return '📼 Новачок з прогресом';
    if (watchedCount >= 1) return '🎞️ Перший перегляд';
    return null;
  };

  const updateGoal = () => {
    if (newGoal > 0) setGoal(newGoal);
  };

  return (
    <div className="movies-wrapper">
      <h2 className="section-title">🎬 Моя бібліотека фільмів</h2>

      <div className="goal-statistics">
        🎯 Мета: {goal} фільмів у 2025
        <div className="goal-update">
          <input
            type="number"
            value={newGoal}
            onChange={(e) => setNewGoal(parseInt(e.target.value) || 0)}
          />
          <button onClick={updateGoal}>Оновити ціль ✏️</button>
        </div>
        <p>📈 Прогрес: {watchedCount}/{goal}</p>
        {getBadge() && <div className="badge">{getBadge()}</div>}
      </div>

      <div className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук фільму..."
        />
        <button onClick={searchMovies}>🔍</button>
      </div>

      <div className="movies-list">
        {savedMovies.map(movie => (
          <div key={movie.id} className="movie-card">
            <button className="delete-button" onClick={() => removeMovie(movie.id)}>🗑️</button>
            {movie.poster && <img src={movie.poster} alt={movie.title} />}
            <div className="movie-info">
              <h4>{movie.title}</h4>
              <p>{movie.overview.slice(0, 60)}...</p>

              <button className={`status-button ${movie.status}`} onClick={() => changeStatus(movie.id)}>
                {movie.status === 'wantToWatch' ? 'Хочу подивитися' : movie.status === 'watching' ? 'Дивлюсь зараз' : 'Переглянуто'}
              </button>

              {movie.imdbLink && (
                <a href={movie.imdbLink} target="_blank" rel="noopener noreferrer" className="watch-link">
                  🎬 Подивитися
                </a>
              )}

              <textarea
                placeholder="Твої враження..."
                value={movie.note}
                onChange={(e) => changeNote(movie.id, e.target.value)}
              />

              <div className="rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={movie.rating >= star ? 'filled' : ''}
                    onClick={() => movie.status === 'watched' && setRating(movie.id, star)}
                    style={{ cursor: movie.status === 'watched' ? 'pointer' : 'default' }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {movie.status !== 'watched' && (
                <div className="hint-text">Оцінку можна залишити лише після перегляду</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="search-results">
        {results.map(movie => (
          <div key={movie.id} className="search-item">
            {movie.poster && <img src={movie.poster} alt={movie.title} />}
            <h4>{movie.title}</h4>
            <button onClick={() => addMovie(movie)}>➕ Додати</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoviesWishList;
