import React, { useState, useEffect } from 'react';
import './BooksWishList.css';

function BooksWishList() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [savedBooks, setSavedBooks] = useState(() =>
    JSON.parse(localStorage.getItem('savedBooks')) || []
  );
  const [goal, setGoal] = useState(() =>
    parseInt(localStorage.getItem('bookGoal')) || 20
  );
  const [newGoal, setNewGoal] = useState(goal);

  useEffect(() => {
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
  }, [savedBooks]);

  useEffect(() => {
    localStorage.setItem('bookGoal', goal.toString());
  }, [goal]);

  const searchBooks = async () => {
    if (!query.trim()) return;
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`);
    const data = await res.json();
    const mapped = data.items?.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.join(', ') || 'Невідомий автор',
      image: item.volumeInfo.imageLinks?.thumbnail,
      previewLink: item.volumeInfo.previewLink || ''
    })) || [];
    setResults(mapped);
  };

  const addBook = (book) => {
    if (!savedBooks.find(b => b.id === book.id)) {
      setSavedBooks(prev => [
        ...prev,
        { ...book, status: 'wantToRead', note: '', rating: 0, readDate: null }
      ]);
    }
  };

  const removeBook = (id) => {
    setSavedBooks(prev => prev.filter(book => book.id !== id));
  };

  const changeStatus = (id) => {
    setSavedBooks(prev => prev.map(book => {
      if (book.id === id) {
        const newStatus = book.status === 'wantToRead' ? 'reading' : book.status === 'reading' ? 'read' : 'wantToRead';
        return {
          ...book,
          status: newStatus,
          readDate: newStatus === 'read' ? new Date().toISOString() : null
        };
      }
      return book;
    }));
  };

  const changeNote = (id, note) => {
    setSavedBooks(prev => prev.map(book =>
      book.id === id ? { ...book, note } : book
    ));
  };

  const setRating = (id, rating) => {
    setSavedBooks(prev => prev.map(book =>
      book.id === id ? { ...book, rating } : book
    ));
  };

  const updateGoal = () => {
    if (newGoal > 0) setGoal(newGoal);
  };

  const currentYear = new Date().getFullYear();
  const booksReadThisYear = savedBooks.filter(book =>
    book.status === 'read' &&
    book.readDate &&
    new Date(book.readDate).getFullYear() === currentYear
  ).length;

  const getBadge = (count) => {
    if (count >= 100) return "🏆📚 Абсолютний книжковий мудрець!";
    if (count >= 75) return "🌟📖 Легенда бібліотеки!";
    if (count >= 50) return "💎📘 Книжковий майстер!";
    if (count >= 35) return "📚🔮 Чарівник слова";
    if (count >= 25) return "📖🔥 Захоплений читач!";
    if (count >= 20) return "🥇 Майстер читання!";
    if (count >= 15) return "📗💡 Просунутий книголюб";
    if (count >= 10) return "🥈 Справжній книголюб!";
    if (count >= 7) return "📘 Новачок із запалом!";
    if (count >= 5) return "🥉 Перший рекорд!";
    if (count >= 3) return "📙 Початківець читач";
    if (count >= 1) return "📕 Перша книга!";
    return null;
  };
  

  return (
    <div className="books-wrapper">

      <h2>📚 Моя бібліотека</h2>

      <div className="goal-statistics">
        <div>🎯 Мета на {currentYear}: {goal} книг</div>
        <div>📈 Прочитано: {booksReadThisYear}/{goal} ({Math.round((booksReadThisYear / goal) * 100)}%)</div>
        {getBadge(booksReadThisYear) && <div className="badge">{getBadge(booksReadThisYear)}</div>}

        <div className="goal-update">
          <input
            type="number"
            value={newGoal}
            onChange={(e) => setNewGoal(Number(e.target.value))}
            min="1"
          />
          <button onClick={updateGoal}>Оновити ціль ✏️</button>
        </div>
      </div>

      <div className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук книги..."
        />
        <button onClick={searchBooks}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 
              6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79l5 5 
              1.5-1.5-5-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 
              5 15 7.01 15 9.5 12.99 14 10.5 14z"/>
          </svg>
        </button>
      </div>

      <div className="books-list">
        {savedBooks.map(book => (
          <div key={book.id} className="book-card">
            <button className="delete-button" onClick={() => removeBook(book.id)}>🗑️</button>
            {book.image && <img src={book.image} alt={book.title} />}
            <div className="book-info">
              <h4>{book.title}</h4>
              <p>{book.author}</p>

              <button
                className={`status-button ${book.status}`}
                onClick={() => changeStatus(book.id)}
              >
                {book.status === 'wantToRead'
                  ? 'Хочу прочитати'
                  : book.status === 'reading'
                    ? 'Читаю зараз'
                    : 'Прочитано'}
              </button>

              {book.previewLink && (
                <a href={book.previewLink} target="_blank" rel="noopener noreferrer" className="read-link">
                  📖 Читати книгу
                </a>
              )}

              <textarea
                placeholder="Твої враження..."
                value={book.note}
                onChange={(e) => changeNote(book.id, e.target.value)}
              />

              <div className="rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={book.rating >= star ? 'filled' : ''}
                    onClick={() => book.status === 'read' && setRating(book.id, star)}
                    style={{ cursor: book.status === 'read' ? 'pointer' : 'default' }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {book.status !== 'read' && (
                <div className="hint-text">Оцінку можна залишити лише після прочитання</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="search-results">
          {results.map(book => (
            <div key={book.id} className="search-item">
              {book.image && <img src={book.image} alt={book.title} />}
              <h4>{book.title}</h4>
              <p>{book.author}</p>
              <button onClick={() => addBook(book)}>➕ Додати</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BooksWishList;
