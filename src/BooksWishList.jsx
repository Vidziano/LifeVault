import React, { useState, useEffect } from 'react';
import './BooksWishList.css';

function BooksWishList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    setBooks(storedBooks);
  }, []);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=10`);
    const data = await response.json();
    setSearchResults(data.items || []);
  };

  const addBook = (book) => {
    const newBook = {
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors?.join(', ') || 'Невідомий автор',
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
      status: 'Хочу прочитати',
      note: '',
      rating: 0,
    };
    setBooks(prevBooks => [...prevBooks, newBook]);
    setSearchResults([]);
    setSearchQuery('');
  };

  const updateBook = (id, field, value) => {
    const updatedBooks = books.map(book =>
      book.id === id ? { ...book, [field]: value } : book
    );
    setBooks(updatedBooks);
  };

  const cycleStatus = (status) => {
    if (status === 'Хочу прочитати') return 'Читаю зараз';
    if (status === 'Читаю зараз') return 'Прочитано';
    return 'Хочу прочитати';
  };

  const getStatusColor = (status) => {
    if (status === 'Хочу прочитати') return '#b0bec5';
    if (status === 'Читаю зараз') return '#64b5f6';
    if (status === 'Прочитано') return '#81c784';
    return '#ccc';
  };

  const handleStarClick = (id, star) => {
    const book = books.find(b => b.id === id);
    if (book?.status === 'Прочитано') {
      updateBook(id, 'rating', star);
    }
  };

  return (
    <div className="books-wrapper">
      <h3>📚 Мій список книг</h3>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Введи назву книги..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={searchBooks}>🔎 Пошук</button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(book => (
            <div key={book.id} className="search-item">
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt="Обкладинка" />
              )}
              <div>
                <h4>{book.volumeInfo.title}</h4>
                <p>{book.volumeInfo.authors?.join(', ')}</p>
                <button onClick={() => addBook(book)}>➕ Додати</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="books-list">
        {books.map(book => (
          <div key={book.id} className="book-card">
            {book.thumbnail && (
              <img src={book.thumbnail} alt="Обкладинка" />
            )}
            <div className="book-info">
              <h4>{book.title}</h4>
              <p>{book.authors}</p>

              <button
                className="status-button"
                style={{ backgroundColor: getStatusColor(book.status) }}
                onClick={() => updateBook(book.id, 'status', cycleStatus(book.status))}
              >
                {book.status}
              </button>

              <textarea
                placeholder="Твої враження..."
                value={book.note}
                onChange={(e) => updateBook(book.id, 'note', e.target.value)}
              />

              <div className="rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => handleStarClick(book.id, star)}
                    className={`star ${star <= book.rating ? 'filled' : ''} ${book.status !== 'Прочитано' ? 'disabled' : ''}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              {book.status !== 'Прочитано' && (
                <div className="hint-text">Щоб поставити оцінку, спочатку прочитай книгу 📚</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksWishList;
