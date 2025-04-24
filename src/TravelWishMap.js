import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import './TravelWishMap.css';
import { feature } from 'topojson-client';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function TravelWishMap() {
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [dreamCountries, setDreamCountries] = useState([]);
  const [mode, setMode] = useState('visited'); // 'visited' or 'dream'

  const toggleCountry = (id) => {
    if (mode === 'visited') {
      setVisitedCountries((prev) =>
        prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      );
    } else {
      setDreamCountries((prev) =>
        prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      );
    }
  };

  const getFill = (id) => {
    if (visitedCountries.includes(id)) return '#69e36a'; // зелений
    if (dreamCountries.includes(id)) return '#83cfff';   // блакитний
    return '#E0E0E0';
  };

  return (
    <div className="travel-map-wrapper">
      <h3>🗺️ Мапа бажаних подорожей</h3>
      <p>Натисни на країну, щоб додати до списку бажаних, або знову натисни, щоб позначити як відвідану.</p>

      <div className="map-mode-buttons">
        <button className={mode === 'visited' ? 'active' : ''} onClick={() => setMode('visited')}>✅ Відвідані</button>
        <button className={mode === 'dream' ? 'active' : ''} onClick={() => setMode('dream')}>🌐 Мрії</button>
      </div>

      <div className="map-container">
        <ComposableMap projectionConfig={{ scale: 140 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => toggleCountry(geo.id)}
                  style={{
                    default: {
                      fill: getFill(geo.id),
                      outline: 'none',
                    },
                    hover: {
                      fill: '#ffd54f',
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: '#ffb300',
                      outline: 'none',
                    }
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}

export default TravelWishMap;
