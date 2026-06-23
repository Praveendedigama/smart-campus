import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { saveNote, getNotes, deleteNote } from '../services/idb.js';
import {
  requestPermission,
  scheduleDeadlineReminders,
  sendTestNotification
} from '../services/notifications.js';

export default function Notes() {
  const { state } = useApp();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [notes, setNotes] = useState([]);
  const [notifStatus, setNotifStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    getNotes().then(setNotes);
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setCameraError(
        'Camera access denied or unavailable. Allow camera access in your browser settings.'
      );
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const captureNote = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const record = await saveNote({
        blob,
        title: `Note — ${new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })}`
      });
      setNotes(prev => [...prev, record]);
    }, 'image/jpeg', 0.8);
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleEnableNotifs = async () => {
    const result = await requestPermission();
    setNotifStatus(result);
    if (result === 'granted') {
      sendTestNotification();
      scheduleDeadlineReminders(state.assignments);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">Notes & Alerts</h1>
      </header>

      {/* Notifications section */}
      <section className="card section">
        <h2 className="section__title">🔔 Deadline Reminders</h2>
        <p className="section__desc">
          Get notified when assignments are due within 24 hours.
        </p>

        {notifStatus === 'unsupported' && (
          <span className="badge badge--warn">Notifications not supported in this browser</span>
        )}
        {notifStatus === 'denied' && (
          <span className="badge badge--danger">
            Notifications blocked — enable them in browser settings
          </span>
        )}
        {notifStatus === 'granted' ? (
          <div className="notif-granted">
            <span className="badge badge--success">✅ Notifications enabled</span>
            <button
              className="btn btn--ghost mt-sm"
              onClick={() => scheduleDeadlineReminders(state.assignments)}
            >
              Check upcoming deadlines now
            </button>
          </div>
        ) : (
          notifStatus !== 'unsupported' && notifStatus !== 'denied' && (
            <button className="btn btn--primary mt-sm" onClick={handleEnableNotifs}>
              Enable Notifications
            </button>
          )
        )}
      </section>

      {/* Camera section */}
      <section className="card section">
        <h2 className="section__title">📷 Capture Lecture Notes</h2>
        <p className="section__desc">
          Photograph your handwritten notes and save them locally.
        </p>

        {cameraError && (
          <p className="field__error mt-sm" role="alert">{cameraError}</p>
        )}

        <div
          className="camera-view"
          style={{ display: cameraActive ? 'block' : 'none' }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-view__video"
          />
          <div className="camera-view__controls">
            <button className="btn btn--primary" onClick={captureNote}>
              📸 Capture
            </button>
            <button className="btn btn--ghost" onClick={stopCamera}>
              Stop
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />

        {!cameraActive && (
          <button className="btn btn--secondary mt-sm" onClick={startCamera}>
            Open Camera
          </button>
        )}
      </section>

      {/* Saved notes gallery */}
      {notes.length > 0 && (
        <section className="section">
          <h2 className="section__title">Saved Notes ({notes.length})</h2>
          <div className="notes-grid">
            {notes.map(note => (
              <div key={note.id} className="note-thumb">
                <img
                  src={URL.createObjectURL(note.blob)}
                  alt={note.title}
                  className="note-thumb__img"
                  loading="lazy"
                />
                <div className="note-thumb__footer">
                  <span className="note-thumb__title">{note.title}</span>
                  <button
                    className="note-thumb__del"
                    onClick={() => handleDeleteNote(note.id)}
                    aria-label={`Delete ${note.title}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
