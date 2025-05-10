import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

function GlobeView({
  countries,
  hoveredCountry,
  setHoveredCountry,
  toggleCountry,
  visitedCountries,
  dreamCountries,
  mousePos
}) {
  const globeEl = useRef();
  const [bgColor, setBgColor] = useState(() => {
    return document.body.classList.contains('dark') ? '#000000' : '#ffffff';
  });

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2 }, 0);
    }
  }, []);

  useEffect(() => {
    const updateBackground = () => {
      const isDark = document.body.classList.contains('dark');
      const newColor = isDark ? '#000000' : '#ffffff';
      setBgColor(newColor);

      if (globeEl.current?.scene) {
        globeEl.current.scene.background = new THREE.Color(newColor);
      }

      if (globeEl.current?.renderer()) {
        globeEl.current.renderer().setClearColor(newColor);
      }
    };

    updateBackground();

    const observer = new MutationObserver(updateBackground);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="globe-wrapper">
        <Globe
          ref={globeEl}
          globeImageUrl={null}
          backgroundColor={bgColor} // <- допоміжне значення
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
  );
}

export default GlobeView;
