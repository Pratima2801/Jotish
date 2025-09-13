import React, { useEffect, useState } from 'react';
import { fetchTableData } from '../services/api';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

const CITY_COORDS = {
  'Edinburgh': [55.9533, -3.1883],
  'Tokyo': [35.6762, 139.6503],
  'San Francisco': [37.7749, -122.4194],
  'San Francisco, CA': [37.7749, -122.4194],
  'London': [51.5074, -0.1278],
  'New York': [40.7128, -74.0060],
  'Singapore': [1.3521, 103.8198],
  'Sidney': [-33.8688, 151.2093], 
  'Sydney': [-33.8688, 151.2093],
  'Tokyo, Japan': [35.6762, 139.6503],
  'Hong Kong': [22.3193, 114.1694],
  'Berlin': [52.52, 13.405],
  'Dublin': [53.3498, -6.2603],
  'Mumbai': [19.0760, 72.8777],
  'Chicago': [41.8781, -87.6298],
  'Los Angeles': [34.0522, -118.2437],
  'Sidney': [-33.8688, 151.2093],
  'San Jose': [37.3382, -121.8863],
  'Sidney': [-33.8688, 151.2093]
  
};

function averageLatLng(coords) {
  if (!coords.length) return [20, 0];
  const sum = coords.reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1]], [0,0]);
  return [sum[0] / coords.length, sum[1] / coords.length];
}

export default function MapPage() {
  const [groups, setGroups] = useState({});
  const [markerCities, setMarkerCities] = useState([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unmapped, setUnmapped] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchTableData()
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res) ? res : (res?.data ?? []);
        setUsedFallback(Array.isArray(res) ? false : Boolean(res?.fromFallback));
      
        const map = {};
        data.forEach(emp => {
          const city = (emp.city ?? 'Unknown').trim();
          if (!map[city]) map[city] = [];
          map[city].push(emp);
        });
        setGroups(map);

        
        const mapped = [];
        const unmappedArr = [];
        Object.keys(map).forEach(city => {
          if (CITY_COORDS[city]) {
            mapped.push(city);
          } else {
            unmappedArr.push(city);
          }
        });
        setMarkerCities(mapped);
        setUnmapped(unmappedArr);
      })
      .catch(err => {
        console.error('MapPage fetch error', err);
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  const center = markerCities.length ? averageLatLng(markerCities.map(c => CITY_COORDS[c])) : [20, 0];
  const zoom = markerCities.length ? 2.5 : 2;

  return (
    <div className="page-container">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 18 }}>
        <div>
          <h2>Employee Cities Map</h2>
          <p className="muted">Markers show cities present in the dataset. Click a marker for employee details.</p>
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="btn-cta" onClick={() => navigate('/list')}>Back to List</button>
        </div>
      </div>

      {usedFallback && !loading && (
        <div style={{ background: '#fff7e6', border: '1px solid #ffd89b', padding: 10, borderRadius: 8, marginBottom: 12, color: '#6a4a00' }}>
          ⚠️ Showing fallback/sample data.
        </div>
      )}

      {loading && <div className="center">Loading map data...</div>}

      {!loading && (
        <div className="table-card" style={{ padding: 0 }}>
          <MapContainer center={center} zoom={zoom} style={{ height: '560px', width: '100%', borderRadius: 8 }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markerCities.map(city => {
              const latlng = CITY_COORDS[city];
              const employees = groups[city] ?? [];
              if (!latlng) return null;
              return (
                <CircleMarker
      key={city}
      center={latlng}
      radius={10} 
      pathOptions={{ color: '#f57c00', fillColor: '#f57c00', fillOpacity: 0.8 }} 
    >
                
                  <Popup>
                    <div style={{ minWidth: 200 }}>
                      <strong>{city}</strong>
                      <div className="muted" style={{ marginBottom: 8 }}>Employees: {employees.length}</div>
                      <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {employees.slice(0, 12).map((e, i) => (
                          <li key={`${e.id ?? 'noid'}-${i}`}>{e.name} — {e.job}</li>
                        ))}
                      </ul>
                      {employees.length > 12 && <div className="muted">+{employees.length - 12} more</div>}
                    </div>
                  </Popup>
                  </CircleMarker>
              );
            })}
          </MapContainer>

          {unmapped.length > 0 && (
            <div style={{ padding: 12 }}>
              <div className="muted">Cities without coordinates (add to CITY_COORDS to show markers):</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
                {unmapped.map(c => <div key={c} style={{ padding: '6px 8px', background:'#fff', borderRadius: 8, border: '1px solid #eee' }}>{c}</div>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
