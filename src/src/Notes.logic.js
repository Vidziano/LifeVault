// Notes.logic.js — логіка роботи з нотатками

export const saveNotes = (notes) => {
    localStorage.setItem('notes', JSON.stringify(notes));
  };
  
  export const handleSaveNote = (notes, note) => {
    const newNotes = [...notes];
    const index = newNotes.findIndex((n) => n.id === note.id);
    if (index >= 0) {
      newNotes[index] = note;
    } else {
      newNotes.push(note);
    }
    saveNotes(newNotes);
    return newNotes;
  };
  
  export const deleteNote = (notes, id) => {
    const newNotes = notes.filter((n) => n.id !== id);
    saveNotes(newNotes);
    return newNotes;
  };
  
  export const togglePin = (notes, id) => {
    const newNotes = notes.map((n) =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    );
    saveNotes(newNotes);
    return newNotes;
  };
  
  export const toggleFavorite = (notes, id) => {
    const newNotes = notes.map((n) =>
      n.id === id ? { ...n, favorite: !n.favorite } : n
    );
    saveNotes(newNotes);
    return newNotes;
  };
  