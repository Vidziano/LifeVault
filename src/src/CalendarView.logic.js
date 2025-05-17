// CalendarView.logic.js — логіка календаря без React

export const saveEvents = (events) => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  };
  
  export const saveTasks = (tasks) => {
    localStorage.setItem('calendarTasks', JSON.stringify(tasks));
  };
  
  export const addEvent = (events, date, text, theme) => {
    if (!text.trim()) return events;
    const d = date.toDateString();
    const updated = { ...events };
    if (!updated[d]) updated[d] = [];
    updated[d].push({ text, theme });
    saveEvents(updated);
    return updated;
  };
  
  export const addTask = (tasks, date, text) => {
    if (!text.trim()) return tasks;
    const d = date.toDateString();
    const updated = { ...tasks };
    if (!updated[d]) updated[d] = [];
    updated[d].push({ text, done: false });
    saveTasks(updated);
    return updated;
  };
  
  export const toggleTask = (tasks, date, index) => {
    const d = date.toDateString();
    const updated = { ...tasks };
    if (updated[d] && updated[d][index]) {
      updated[d][index].done = !updated[d][index].done;
      saveTasks(updated);
    }
    return updated;
  };
  
  export const deleteEvent = (events, date, index) => {
    const d = date.toDateString();
    const updated = { ...events };
    if (updated[d]) {
      updated[d].splice(index, 1);
      if (updated[d].length === 0) delete updated[d];
      saveEvents(updated);
    }
    return updated;
  };
  
  export const deleteTask = (tasks, date, index) => {
    const d = date.toDateString();
    const updated = { ...tasks };
    if (updated[d]) {
      updated[d].splice(index, 1);
      if (updated[d].length === 0) delete updated[d];
      saveTasks(updated);
    }
    return updated;
  };
  
  export const handleEditChange = (obj, date, index, newText) => {
    const d = date.toDateString();
    const updated = { ...obj };
    if (updated[d] && updated[d][index]) {
      updated[d][index].text = newText;
    }
    return updated;
  };
  
  export const handleTransfer = (tasks, date) => {
    const today = date.toDateString();
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.toDateString();
  
    const updated = { ...tasks };
    const from = updated[y]?.filter((t) => !t.done) || [];
    if (from.length) {
      if (!updated[today]) updated[today] = [];
      updated[today] = [...updated[today], ...from];
      updated[y] = updated[y].filter((t) => t.done);
      if (updated[y].length === 0) delete updated[y];
      saveTasks(updated);
    }
    return updated;
  };
  