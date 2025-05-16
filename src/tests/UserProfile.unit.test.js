// UserProfile.unit.test.js
import {
    getInitialProfile,
    saveProfileToStorage,
    getAvatarSource,
    getNotificationsState,
    saveNotificationsState
  } from '../src/UserProfile.logic';
  
  describe('UserProfile юніт-тести', () => {
    beforeEach(() => {
      localStorage.clear();
    });
  
    test('getInitialProfile повертає дефолтний профіль, якщо в storage нічого немає', () => {
      expect(getInitialProfile()).toEqual({
        name: '',
        status: '',
        birthday: '',
        avatar: '/avatars/avatar1.png',
        customAvatar: ''
      });
    });
  
    test('getInitialProfile повертає дані з localStorage', () => {
      const mock = { name: 'Anna', status: 'Busy', birthday: '1990-01-01', avatar: '/a.png', customAvatar: '' };
      localStorage.setItem('userProfile', JSON.stringify(mock));
      expect(getInitialProfile()).toEqual(mock);
    });
  
    test('saveProfileToStorage зберігає профіль у localStorage', () => {
      const mock = { name: 'Test', status: '', birthday: '', avatar: '', customAvatar: '' };
      saveProfileToStorage(mock);
      expect(JSON.parse(localStorage.getItem('userProfile'))).toEqual(mock);
    });
  
    test('getAvatarSource повертає customAvatar, якщо є', () => {
      const profile = { customAvatar: 'data:image', avatar: '/img.png' };
      expect(getAvatarSource(profile)).toBe('data:image');
    });
  
    test('getAvatarSource повертає avatar, якщо customAvatar немає', () => {
      const profile = { customAvatar: '', avatar: '/img.png' };
      expect(getAvatarSource(profile)).toBe('/img.png');
    });
  
    test('getNotificationsState повертає true за замовчуванням', () => {
      expect(getNotificationsState()).toBe(true);
    });
  
    test('getNotificationsState повертає false, якщо збережено false', () => {
      localStorage.setItem('notifications', 'false');
      expect(getNotificationsState()).toBe(false);
    });
  
    test('saveNotificationsState зберігає значення в localStorage', () => {
      saveNotificationsState(false);
      expect(localStorage.getItem('notifications')).toBe('false');
    });
  });
  