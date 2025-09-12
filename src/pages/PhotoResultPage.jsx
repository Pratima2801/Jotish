import React, { useEffect, useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import CameraCapture from '../components/CameraCapture';
import '../styles/main.css';

function makeRowKeyFromEmployee(emp) { 
  if (!emp) return `no-employee-${Date.now()}`;
  const id = emp?.id ?? 'no-id';
  const name = (emp?.name ?? 'no-name').replace(/\s+/g, '_');
  const dt = emp?.startDate ?? '';
  return `${id}-${name}-${dt}`;
}

function PhotoResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const employee = location?.state?.employee ?? null;
  const providedRowKey = location?.state?.rowKey ?? null;
  
  const incomingImage = location?.state?.image ?? null;

  const rowKey = providedRowKey ?? makeRowKeyFromEmployee(employee);
  const storageKey = `photo_${rowKey}`;

  const [image, setImage] = useState(incomingImage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
     
      if (incomingImage) {
        setImage(incomingImage);
      } else {
        const stored = localStorage.getItem(storageKey);
        if (stored) setImage(stored);
      }
    } catch (e) {
      console.error('PhotoResultPage read storage error', e);
    } finally {
      setLoading(false);
    }
  }, [storageKey, incomingImage]);

  const handleCapture = (dataUrl) => {
    try {
      localStorage.setItem(storageKey, dataUrl);
      setImage(dataUrl);
    } catch (e) {
      console.error('Failed to save image to localStorage', e);
      alert('Could not save the photo locally. Storage may be full or restricted.');
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const a = document.createElement('a');
    a.href = image;
    a.download = `${(employee?.name ?? 'photo')}-${rowKey}.jpg`;
    a.click();
  };

  const handleRetake = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('Unable to remove photo from storage', e);
    }
    setImage(null);
  };

  return (
    <div className="page-container">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 18 }}>
        <h2>Photo Result</h2>
        <div>
         
          <button className="btn-cta" onClick={() => navigate('/list')}>Back to List</button> {/* UPDATED */}
        </div>
      </div>

      {!employee ? (
        <div className="center">No employee selected. Go to the list and open details first.</div>
      ) : (
        <div className="detail-card">
          <div style={{ marginBottom: 12 }}>
            <strong>{employee.name}</strong> — <span className="muted">{employee.job}</span>
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>RowKey: {rowKey}</div>
          </div>

          {loading && <div className="center">Loading photo...</div>}

          {!loading && image && (
            <div style={{ textAlign: 'center' }}>
              <img
                src={image}
                alt="Captured"
                style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}
              />
              <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button className="btn-primary-sm" onClick={handleDownload}>Download</button>
                <button className="btn-outline" onClick={handleRetake}>Retake</button>
              </div>
            </div>
          )}

          {!loading && !image && (
            <div>
              <p className="muted">No photo yet. Use your camera below to capture one.</p>

              <div style={{ marginTop: 12 }}>
                <CameraCapture onCapture={handleCapture} preferMedia={true} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PhotoResultPage;
