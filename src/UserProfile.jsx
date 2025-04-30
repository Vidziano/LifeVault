import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const avatarOptions = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  '/avatars/avatar6.png',
  '/avatars/avatar7.png',
  '/avatars/avatar8.png',
  '/avatars/avatar9.png',
  '/avatars/avatar10.png',
  '/avatars/avatar11.png',
  '/avatars/avatar12.png'
];

function UserProfile() {
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) return JSON.parse(stored);

    const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
    return {
      name: '',
      status: '',
      birthday: '',
      avatar: randomAvatar,
      customAvatar: ''
    };
  });

  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({ ...prev, customAvatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const displayedAvatar = profile.customAvatar || profile.avatar;

  return (
    <div className="user-profile">
      <h2>👤 Профіль користувача</h2>
      <img src={displayedAvatar} alt="Аватар" className="avatar" />

      {editing ? (
        <>
          <div className="form-row">
            <label>Ім’я:</label>
            <input
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Статус:</label>
            <input
              value={profile.status}
              onChange={(e) => handleChange('status', e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>День народження:</label>
            <input
              type="date"
              value={profile.birthday}
              onChange={(e) => handleChange('birthday', e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Завантажити своє фото:</label>
            <input type="file" accept="image/*" onChange={handleAvatarFile} />
          </div>

          <div className="form-row">
            <label>Або вибери з варіантів:</label>
            <div className="avatar-options">
              {avatarOptions.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`avatar-${i}`}
                  className={`option ${profile.avatar === src ? 'selected' : ''}`}
                  onClick={() => handleChange('avatar', src)}
                />
              ))}
            </div>
          </div>

          <button onClick={() => setEditing(false)}>💾 Зберегти</button>
        </>
      ) : (
        <>
          <p><strong>Ім’я:</strong> {profile.name || 'не вказано'}</p>
          <p><strong>Статус:</strong> {profile.status || 'не вказано'}</p>
          <p><strong>День народження:</strong> {profile.birthday || 'не вказано'}</p>
          <button onClick={() => setEditing(true)}>✏️ Редагувати</button>
        </>
      )}
    </div>
  );
}

export default UserProfile;
