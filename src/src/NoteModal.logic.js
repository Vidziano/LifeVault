// NoteModal.logic.js — логіка для модалки нотаток

export const isNoteValid = (note) => {
    return note.text.trim() !== '' && note.category.trim() !== '';
  };
  
  export const buildNoteFromInputs = (inputs, editingNote) => {
    return {
      ...editingNote,
      ...inputs,
      updated: new Date().toISOString()
    };
  };
  
  export const handleRemoveImageLogic = (note) => {
    return {
      ...note,
      fileUrl: '',
      fileName: ''
    };
  };
  