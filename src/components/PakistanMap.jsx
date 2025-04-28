import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

// Simplified Pakistan GeoJSON data
const simplifiedPakistan = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Punjab" },
      geometry: {
        type: "Polygon",
        coordinates: [[[71, 29], [74, 31], [75, 33], [73, 34], [71, 32], [71, 29]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Sindh" },
      geometry: {
        type: "Polygon",
        coordinates: [[[67, 24], [71, 26], [71, 29], [69, 28], [66, 25], [67, 24]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Balochistan" },
      geometry: {
        type: "Polygon",
        coordinates: [[[61, 25], [66, 25], [69, 28], [71, 29], [71, 32], [69, 31], [66, 29], [61, 28], [61, 25]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Khyber Pakhtunkhwa" },
      geometry: {
        type: "Polygon",
        coordinates: [[[69, 31], [71, 32], [73, 34], [73, 36], [71, 36], [70, 35], [69, 33], [69, 31]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Gilgit-Baltistan" },
      geometry: {
        type: "Polygon",
        coordinates: [[[73, 34], [75, 33], [77, 35], [76, 37], [74, 37], [73, 36], [73, 34]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Azad Kashmir" },
      geometry: {
        type: "Polygon",
        coordinates: [[[73, 34], [74, 34], [75, 35], [74, 36], [73, 36], [73, 34]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Islamabad" },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.9, 33.5], [73.2, 33.5], [73.2, 33.8], [72.9, 33.8], [72.9, 33.5]]]
      }
    }
  ]
};

// Sample locations data
const sampleLocations = [
  { id: "1", name: "Karachi", longitude: 67.0099, latitude: 24.8607, province: "Sindh" },
  { id: "2", name: "Lahore", longitude: 74.3587, latitude: 31.5204, province: "Punjab" },
  { id: "3", name: "Islamabad", longitude: 73.0479, latitude: 33.6844, province: "Islamabad" },
];

const PakistanMap = ({ locations = sampleLocations }) => {
  const [position, setPosition] = useState({ coordinates: [70, 30], zoom: 3 });

  // Zoom controls
  const handleZoomIn = () => {
    if (position.zoom >= 8) return;
    setPosition(prev => ({ ...prev, zoom: prev.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(prev => ({ ...prev, zoom: prev.zoom / 1.5 }));
  };

  const handleMoveEnd = (position) => {
    setPosition(position);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Map Controls */}
      <div className="absolute right-4 bottom-4 z-10 flex flex-col bg-white bg-opacity-80 rounded shadow p-1">
        <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
        <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1800,
          center: [70, 30] // Centered on Pakistan
        }}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={simplifiedPakistan}>
            {({ geographies }) =>
              geographies.map(geo => {
                const provinceName = geo.properties.name;
                
                return (
                  <Geography
                    key={geo.rsmKey || provinceName}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#D6D6DA"
                    className="hover:fill-blue-300 focus:fill-blue-300"
                  />
                );
              })
            }
          </Geographies>

          {locations.map(({ id, name, longitude, latitude }) => (
            <Marker key={id} coordinates={[longitude, latitude]}>
              <circle r={5} fill="#F00" stroke="#fff" strokeWidth={2} />
              <text
                textAnchor="middle"
                y={-10}
                style={{
                  fontFamily: "system-ui",
                  fontSize: "10px",
                  fontWeight: "bold",
                  fill: "#000",
                  textShadow: "1px 1px 1px #FFF"
                }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default PakistanMap;