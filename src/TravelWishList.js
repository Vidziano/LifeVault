import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import './TravelWishMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function TravelWishMap() {
  const [visitedCountries, setVisitedCountries] = useState(() => {
    const saved = localStorage.getItem('visitedCountries');
    return saved ? JSON.parse(saved) : [];
  });

  const [dreamCountries, setDreamCountries] = useState(() => {
    const saved = localStorage.getItem('dreamCountries');
    return saved ? JSON.parse(saved) : [];
  });

  const [mode, setMode] = useState('visited');
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

  const toggleCountry = (id, name) => {
    const update = (list, setList) => {
      const exists = list.find(c => c.id === id);
      if (exists) {
        setList(list.filter(c => c.id !== id));
      } else {
        setList([...list, { id, name, city: '', comment: '', showCity: false, showComment: false }]);
      }
    };
    if (mode === 'visited') {
      update(visitedCountries, setVisitedCountries);
    } else {
      update(dreamCountries, setDreamCountries);
    }
  };

  const getFill = (id) => {
    if (visitedCountries.find(c => c.id === id)) return '#69e36a';
    if (dreamCountries.find(c => c.id === id)) return '#83cfff';
    return '#E0E0E0';
  };

  const handleMoveEnd = (pos) => setPosition(pos);

  const handleFieldToggle = (list, setList, id, field) => {
    const updated = list.map(c => c.id === id ? { ...c, [field]: !c[field] } : c);
    setList(updated);
  };

  const handleChange = (list, setList, id, field, value) => {
    const updated = list.map(c => c.id === id ? { ...c, [field]: value } : c);
    setList(updated);
  };

  const renderList = (title, countries, setList) => (
    <div className="country-block">
      <h4>{title}</h4>
      {countries.map(({ id, name, city, comment, showCity, showComment }) => (
        <div key={id} className="country-row">
          <span>{name}</span>
          <div className="small-buttons">
            <button onClick={() => handleFieldToggle(countries, setList, id, 'showCity')}>🏰 Додати місто</button>
            <button onClick={() => handleFieldToggle(countries, setList, id, 'showComment')}>📝 Коментар</button>
          </div>
          {showCity && (
            <input
              type="text"
              placeholder="Місто"
              value={city}
              onChange={(e) => handleChange(countries, setList, id, 'city', e.target.value)}
            />
          )}
          {showComment && (
            <textarea
              placeholder="Коментар"
              value={comment}
              onChange={(e) => handleChange(countries, setList, id, 'comment', e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Автозбереження в localStorage
  useEffect(() => {
    localStorage.setItem('visitedCountries', JSON.stringify(visitedCountries));
  }, [visitedCountries]);

  useEffect(() => {
    localStorage.setItem('dreamCountries', JSON.stringify(dreamCountries));
  }, [dreamCountries]);

  return (
    <div className="travel-map-wrapper" onMouseMove={handleMouseMove}>
      <h3>🗺️ Мапа бажаних подорожей</h3>
      <p>Натисни на країну, щоб додати до списку бажаних, або знову натисни, щоб позначити як відвідану.</p>

      <div className="map-mode-buttons">
        <button
          className={mode === 'visited' ? 'active' : ''}
          onClick={() => setMode('visited')}
        >
          Відвідані
        </button>
        <button
          className={mode === 'dream' ? 'active' : ''}
          onClick={() => setMode('dream')}
        >
          Мрії
        </button>
      </div>

      {hoveredCountry && (
        <div className="hover-tooltip" style={{ top: mousePos.y + 15, left: mousePos.x + 15 }}>
          {hoveredCountry}
        </div>
      )}

      <div className="map-and-panel">
        <div className="map-container">
          <ComposableMap>
            <ZoomableGroup
              center={position.coordinates}
              zoom={position.zoom}
              onMoveEnd={handleMoveEnd}
              minZoom={1}
              maxZoom={5}
              translateExtent={[[-1500, -800], [1500, 800]]}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => toggleCountry(geo.id, geo.properties.name)}
                      onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        default: {
                          fill: getFill(geo.id),
                          stroke: "#999",
                          strokeWidth: 0.5,
                          outline: "none"
                        },
                        hover: {
                          fill: "#ffd54f",
                          stroke: "#555",
                          strokeWidth: 0.75,
                          cursor: "pointer",
                          outline: "none"
                        },
                        pressed: {
                          fill: "#ffb300",
                          outline: "none"
                        }
                      }}
                    />
                  ))
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className="info-columns">
          <div className="info-panel">
            {renderList("✅ Відвідані", visitedCountries, setVisitedCountries)}
          </div>
          <div className="info-panel">
            {renderList("🌐 Мрії", dreamCountries, setDreamCountries)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelWishMap;
