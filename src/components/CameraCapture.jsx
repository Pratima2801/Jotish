import React, { useRef, useState, useEffect } from 'react';

export default function CameraCapture({ onCapture, preferMedia = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [usingMedia, setUsingMedia] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);

  const startMedia = async () => {
    setError('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API not available in this browser. Use file input below.');
      return;
    }

    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play().catch(() => {});
      }
      setUsingMedia(true);
    } catch (err) {
      console.error('startMedia error', err);
      setError('Could not access camera. Make sure you allowed camera permissions.');
     
    }
  };

  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setUsingMedia(false);
  };

  const captureFromVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    stopMedia();
    onCapture(dataUrl);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      onCapture(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      
      {preferMedia && !usingMedia && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary-sm" onClick={startMedia}>Use Camera</button>
          <div style={{ alignSelf: 'center' }} className="muted">or use file chooser below</div>
        </div>
      )}

      {usingMedia && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <video ref={videoRef} style={{ width: '100%', borderRadius: 8, background: '#000' }} playsInline />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary-sm" onClick={captureFromVideo}>Capture</button>
            <button className="btn-outline" onClick={stopMedia}>Cancel</button>
          </div>
        </div>
      )}

      <div>
        <label className="btn-outline" style={{ cursor: 'pointer', display: 'inline-block' }}>
          Choose Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {error && <div className="error">{error}</div>}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
