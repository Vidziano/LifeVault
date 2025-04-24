import React, { useState } from 'react';
import './TravelWishList.css';
import TravelWishMap from './TravelWishMap';

function TravelWishList({ onBack }) {
  const [mode, setMode] = useState('visited'); // 'visited' або 'dream'

  return (
    <div className="travel-wishlist">
      <button className="back-btn" onClick={onBack}>← Назад</button>
      <h2>Подорожі</h2>

      <div className="map-container">
        <h3>🗺️ Мапа бажаних подорожей</h3>
        <p>Натисни на країну, щоб додати до списку бажаних, або знову натисни, щоб позначити як відвідану.</p>

        <div className="mode-toggle">
          <button
            className={mode === 'visited' ? 'active' : ''}
            onClick={() => setMode('visited')}
          >
            ✅ Відвідані
          </button>
          <button
            className={mode === 'dream' ? 'active' : ''}
            onClick={() => setMode('dream')}
          >
            🌐 Мрії
          </button>
        </div>

        <TravelWishMap mode={mode} />
      </div>
    </div>
  );
}

export default TravelWishList;
