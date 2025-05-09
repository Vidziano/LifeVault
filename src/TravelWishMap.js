import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import * as topojson from 'topojson-client';
import './TravelWishMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function TravelWishMap() {
  const globeEl = useRef();
  const [viewMode, setViewMode] = useState('globe');
  const [mode, setMode] = useState('visited');
  const [countries, setCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const [visitedCountries, setVisitedCountries] = useState(() => {
    const saved = localStorage.getItem('visitedCountries');
    return saved ? JSON.parse(saved) : [];
  });

  const [dreamCountries, setDreamCountries] = useState(() => {
    const saved = localStorage.getItem('dreamCountries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((topology) => {
        const geo = topojson.feature(topology, topology.objects.countries).features;
        setCountries(geo);
      });
  }, []);

  useEffect(() => {
    if (globeEl.current && viewMode === 'globe') {
      globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2 }, 0);
    }
  }, [viewMode]);

  useEffect(() => {
    let frameId;
  
    const updateSceneBackground = () => {
      const globe = globeEl.current;
      if (globe && globe.scene && globe.scene.background) {
        const isDark = document.body.classList.contains('dark');
        globe.scene.background.set(isDark ? '#111111' : '#ffffff');
      } else {
        frameId = requestAnimationFrame(updateSceneBackground);
      }
    };
  
    updateSceneBackground();
  
    const observer = new MutationObserver(() => {
      const globe = globeEl.current;
      if (globe && globe.scene && globe.scene.background) {
        const isDark = document.body.classList.contains('dark');
        globe.scene.background.set(isDark ? '#111111' : '#ffffff');
      }
    });
  
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);
  
  
  
  

  useEffect(() => {
    localStorage.setItem('visitedCountries', JSON.stringify(visitedCountries));
  }, [visitedCountries]);

  useEffect(() => {
    localStorage.setItem('dreamCountries', JSON.stringify(dreamCountries));
  }, [dreamCountries]);

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

  const getColor = (id) => {
    if (visitedCountries.find(c => c.id === id)) return '#69e36a';
    if (dreamCountries.find(c => c.id === id)) return '#83cfff';
    return '#e0e0e0';
  };

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
            <button onClick={() => handleFieldToggle(countries, setList, id, 'showCity')}>🏰</button>
            <button onClick={() => handleFieldToggle(countries, setList, id, 'showComment')}>📝</button>
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

  return (
    <div className="travel-map-wrapper" onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}>
      <h3>🗺️ Мапа бажаних подорожей</h3>
      <p>Натисни на країну, щоб додати до списку бажаних або знову натисни, щоб позначити як відвідану.</p>

      <div className="map-mode-buttons">
        <button className={mode === 'visited' ? 'active' : ''} onClick={() => setMode('visited')}>✅ Відвідані</button>
        <button className={mode === 'dream' ? 'active' : ''} onClick={() => setMode('dream')}>🌐 Мрії</button>
      </div>

      <div className="map-and-panel">
        <div className="map-container">
          {viewMode === 'globe' ? (
            <>
              <div className="globe-wrapper">
                <Globe
                  ref={globeEl}
                  globeImageUrl={null}
                  globeMaterial={new THREE.MeshPhongMaterial({
                    color: '#ffffff',
                    specular: '#ccc',
                    shininess: 5
                  })}
                  showAtmosphere={false}
                  polygonsData={countries}
                  polygonAltitude={0.01}
                  polygonCapColor={(feat) => {
                    const id = feat.id;
                    if (hoveredCountry && feat.properties.name === hoveredCountry) return '#ffd54f';
                    if (visitedCountries.find(c => c.id === id)) return '#69e36a';
                    if (dreamCountries.find(c => c.id === id)) return '#83cfff';
                    return '#333';
                  }}
                  polygonSideColor={() => '#444'}
                  polygonStrokeColor={() => '#555'}
                  onPolygonClick={(feat) => toggleCountry(feat.id, feat.properties.name)}
                  onPolygonHover={(feat) => setHoveredCountry(feat?.properties?.name || null)}
                  polygonsTransitionDuration={300}
                />
              </div>
              {hoveredCountry && (
                <div className="hover-tooltip" style={{ top: mousePos.y + 10, left: mousePos.x + 10 }}>
                  {hoveredCountry}
                </div>
              )}
            </>
          ) : (
            <>
              <ComposableMap>
                <ZoomableGroup
                  center={position.coordinates}
                  zoom={position.zoom}
                  onMoveEnd={(pos) => setPosition(pos)}
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
                              fill: getColor(geo.id),
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
              {hoveredCountry && (
                <div className="hover-tooltip" style={{ top: mousePos.y + 10, left: mousePos.x + 10 }}>
                  {hoveredCountry}
                </div>
              )}
            </>
          )}
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

      <div className="view-toggle">
        <button className={viewMode === 'globe' ? 'active' : ''} onClick={() => setViewMode('globe')}>🌍</button>
        <button className={viewMode === 'map' ? 'active' : ''} onClick={() => setViewMode('map')}>🗺️</button>
      </div>
    </div>
  );
}

export default TravelWishMap;
