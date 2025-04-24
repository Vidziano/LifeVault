import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './TravelWishList.css';
import L from 'leaflet';

const TravelWishList = () => {
  const [places, setPlaces] = useState([]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const newPlace = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          note: prompt('Додай назву міста або коментар:')
        };
        if (newPlace.note) setPlaces([...places, newPlace]);
      }
    });
    return null;
  }

  return (
    <div className="travel-map-container">
      <h2>🗺️ Мапа мрій</h2>
      <p>Клікни на мапі, щоб додати мітку про місто/країну мрії!</p>
      <MapContainer center={[48.3794, 31.1656]} zoom={5} scrollWheelZoom={true} style={{ height: "600px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {places.map((place, i) => (
          <Marker key={i} position={[place.lat, place.lng]} icon={L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", iconSize: [25, 41], iconAnchor: [12, 41] })}>
            <Popup>{place.note}</Popup>
          </Marker>
        ))}
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default TravelWishList;
