// QuickNotesWidget.logic.js — логіка, винесена з компонента

export const getFavoriteNotes = (notes) => {
    if (!Array.isArray(notes)) return [];
    return notes.filter((n) => n.favorite);
  };
  