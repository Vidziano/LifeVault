// TravelWishMap.logic.js

export function toggleCountryLogic(list, id, name) {
    const exists = list.find(c => c.id === id);
    if (exists) {
      return list.filter(c => c.id !== id);
    } else {
      return [...list, { id, name, city: '', comment: '', showCity: false, showComment: false }];
    }
  }
  
  export function getColor(id, visitedCountries, dreamCountries) {
    if (visitedCountries.find(c => c.id === id)) return '#69e36a';
    if (dreamCountries.find(c => c.id === id)) return '#83cfff';
    return '#e0e0e0';
  }
  
  export function handleFieldToggleLogic(list, id, field) {
    return list.map(c => c.id === id ? { ...c, [field]: !c[field] } : c);
  }
  
  export function handleChangeLogic(list, id, field, value) {
    return list.map(c => c.id === id ? { ...c, [field]: value } : c);
  }
  