import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
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
      <h1 className="sidebar-title">📘 LifeVault</h1>
      <ul>
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <AchievementProvider> {/* Огортаємо весь додаток */}
      <Router>
        <div className="layout">
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="main">
            <AchievementMonitor /> {/* Тут підключається монітор */}
            <MotivationalQuote />
            <QuickNotesWidget />
            <PersonalizedReminder />
            <Routes>
              <Route path="/notes" element={<Notes />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/habits" element={<HabitTracker />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/inspo" element={<InspirationBoard />} />
              <Route path="/wishlist" element={<WishList />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="*" element={<Notes />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AchievementProvider>
  );
}

export default AppWrapper;