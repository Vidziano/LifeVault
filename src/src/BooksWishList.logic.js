// BooksWishList.logic.js

export function getBadge(count) {
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
  }
  
  export function addBook(savedBooks, book) {
    if (savedBooks.find(b => b.id === book.id)) return savedBooks;
    return [...savedBooks, { ...book, status: 'wantToRead', note: '', rating: 0, readDate: null }];
  }
  
  export function changeStatus(savedBooks, id) {
    return savedBooks.map(book => {
      if (book.id !== id) return book;
      const nextStatus = book.status === 'wantToRead' ? 'reading' : book.status === 'reading' ? 'read' : 'wantToRead';
      return {
        ...book,
        status: nextStatus,
        readDate: nextStatus === 'read' ? new Date().toISOString() : null
      };
    });
  }
  
  export function setRating(savedBooks, id, rating) {
    return savedBooks.map(book => book.id === id ? { ...book, rating } : book);
  }
  
  export function updateGoal(current, newGoal) {
    return newGoal > 0 ? newGoal : current;
  }
  