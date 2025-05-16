// UserProfile.logic.js – логіка, винесена з компонента

export const getInitialProfile = () => {
    try {
      return JSON.parse(localStorage.getItem('userProfile')) || {
        name: '',
        status: '',
        birthday: '',
        avatar: '/avatars/avatar1.png',
        customAvatar: ''
      };
    } catch {
      return {
        name: '',
        status: '',
        birthday: '',
        avatar: '/avatars/avatar1.png',
        customAvatar: ''
      };
    }
  };
  
  export const saveProfileToStorage = (profile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };
  
  export const getAvatarSource = (profile) => {
    return profile.customAvatar || profile.avatar || '/avatars/avatar1.png';
  };
  
  export const getNotificationsState = () => {
    return localStorage.getItem('notifications') !== 'false';
  };
  
  export const saveNotificationsState = (enabled) => {
    localStorage.setItem('notifications', String(enabled));
  };
  