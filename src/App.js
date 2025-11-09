import React, { useState, useEffect } from 'react';

import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink
} from 'react-router-dom';

import { AchievementProvider } from './AchievementContext';
import AchievementMonitor from './AchievementMonitor';
import Achievements from './Achievements';

import './App.css';
import './Sidebar.css';
import './Calendarview.css';
import './Habits.css';
import './HabitTracker.css';
import './Notes.css';
import './MoodTracker.css'; 
import './InspirationBoard.css';
import './QuickNotesWidget';
import './PersonalizedReminder';
import './WishList';
import UserProfile from './UserProfile';

import MotivationalQuote from './MotivationalQuote';
import InspirationBoard from './InspirationBoard';
import HabitTracker from './HabitTracker';
import CalendarView from './CalendarView';
import Notes from './Notes';
import MoodTracker from './MoodTracker'; 
import QuickNotesWidget from './QuickNotesWidget';
import PersonalizedReminder from './PersonalizedReminder';
import WishList from './WishList';



function Sidebar({ darkMode, setDarkMode }) {
  return (
    <div className="sidebar">
<div className="sidebar-brand">
<img
  src={darkMode 
    ? `${process.env.PUBLIC_URL}/Logo_LV_dark_theme2.png`   // логотип для темної теми
    : `${process.env.PUBLIC_URL}/Logo_LV.png`}       // логотип для світлої
  alt="LifeVault logo"
  className="sidebar-logo"
/>

  <span className="sidebar-text">LifeVault</span>
</div>





      <ul>
        <li>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>👤 Профіль</NavLink>
        </li>
        <li>
          <NavLink to="/notes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>📝 Нотатки</NavLink>
        </li>
        <li>
          <NavLink to="/calendar" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>📅 Календар</NavLink>
        </li>
        <li>
          <NavLink to="/habits" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>🎯 Трекер звичок</NavLink>
        </li>
        <li>
          <NavLink to="/mood" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>😊 Настрій</NavLink>
        </li>
        <li>
          <NavLink to="/inspo" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>🌟 Натхнення</NavLink>
        </li>
        <li>
          <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>💖 Бажання</NavLink>
        </li>
        <li>
          <NavLink to="/achievements" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>🏆 Нагороди</NavLink>
        </li>
      </ul>
      <div className="theme-toggle">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Світла тема' : '🌙 Темна тема'}
        </button>
      </div>
    </div>
  );
}


function AppWrapper() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <AchievementProvider>
      <Router>
        <div className="layout">
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="main">
            <AchievementMonitor />
            <div style={{ position: 'absolute', right: '20px', top: '80px', zIndex: 1000 }}>
            </div>
            <PersonalizedReminder />
            <Routes>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/habits" element={<HabitTracker />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/inspo" element={<InspirationBoard />} />
              <Route path="/wishlist" element={<WishList />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="*" element={<Notes />} />
            </Routes>
            <QuickNotesWidget />
            <MotivationalQuote />
          </main>
        </div>
      </Router>
    </AchievementProvider>
  );
}

export default AppWrapper;