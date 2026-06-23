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
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError]   = useState('');
  const [captured, setCaptured]         = useState(false);
  const [notes, setNotes]               = useState([]);

  const [notifStatus, setNotifStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [notifsMuted, setNotifsMuted] = useState(
    () => localStorage.getItem('notifsMuted') === 'true'
  );

  useEffect(() => {
    getNotes().then(setNotes);
    return () => stopCamera();
  }, []);

  /* ── Camera ─────────────────────────────────── */
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      setCaptured(false);
    } catch {
      setCameraError('Camera access denied. Allow camera in your browser settings and try again.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const captureNote = () => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const record = await saveNote({
        blob,
        title: `Note — ${new Date().toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit'
        })}`
      });
      setNotes(prev => [record, ...prev]);
      setCaptured(true);
      setTimeout(() => setCaptured(false), 1500);
    }, 'image/jpeg', 0.85);
  };

  /* ── Notifications ───────────────────────────── */
  const handleEnableNotifs = async () => {
    const result = await requestPermission();
    setNotifStatus(result);
    if (result === 'granted') {
      setNotifsMuted(false);
      localStorage.setItem('notifsMuted', 'false');
      sendTestNotification();
      scheduleDeadlineReminders(state.assignments);
    }
  };

  const handleMuteToggle = () => {
    const next = !notifsMuted;
    setNotifsMuted(next);
    localStorage.setItem('notifsMuted', String(next));
  };



  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="page-header__greeting">Smart Campus</p>
          <h1 className="page-header__title">Notes & Alerts</h1>
        </div>
      </header>

      {/* ── Notifications card ─────────────────── */}
      <section className="card notes-section">
        <div className="notes-section__head">
          <span className="notes-section__icon">🔔</span>
          <div>
            <h2 className="notes-section__title">Deadline Reminders</h2>
            <p className="notes-section__desc">Alerts 24 h before assignments are due</p>
          </div>
        </div>

        {notifStatus === 'unsupported' && (
          <div className="notif-pill notif-pill--warn">
            ⚠️ Notifications not supported in this browser
          </div>
        )}

        {notifStatus === 'denied' && (
          <div className="notif-pill notif-pill--danger">
            🚫 Blocked — go to browser Settings → Notifications → allow this site
          </div>
        )}

        {notifStatus === 'granted' && (
          <div className={`notif-pill ${notifsMuted ? 'notif-pill--muted' : 'notif-pill--success'}`}>
            {notifsMuted ? '🔕 Notifications muted' : '✅ Notifications active'}
          </div>
        )}

        <div className="notes-actions">
          {notifStatus !== 'unsupported' && notifStatus !== 'denied' && notifStatus !== 'granted' && (
            <button className="btn btn--primary notes-actions__main" onClick={handleEnableNotifs}>
              🔔 Enable Notifications
            </button>
          )}

          {notifStatus === 'granted' && (
            <button
              className={`btn notes-actions__main ${notifsMuted ? 'btn--enable' : 'btn--ghost'}`}
              onClick={handleMuteToggle}
            >
              {notifsMuted ? '🔔 Unmute Notifications' : '🔕 Mute Notifications'}
            </button>
          )}
        </div>
      </section>

      {/* ── Camera card ────────────────────────── */}
      <section className="card notes-section">
        <div className="notes-section__head">
          <span className="notes-section__icon">📷</span>
          <div>
            <h2 className="notes-section__title">Capture Notes</h2>
            <p className="notes-section__desc">Photo your handwritten notes — saved offline</p>
          </div>
        </div>

        {/* Viewfinder — always in DOM so ref is valid */}
        <div className={`camera-view${cameraActive ? '' : ' camera-view--hidden'}`}>
          <video ref={videoRef} autoPlay playsInline className="camera-view__video" />
          {captured && <div className="camera-flash" />}
        </div>

        {/* Placeholder when camera is off */}
        {!cameraActive && (
          <div className="camera-placeholder">
            <span className="camera-placeholder__icon">📷</span>
            <span className="camera-placeholder__text">Camera off</span>
          </div>
        )}

        {cameraError && (
          <p className="field__error camera-error" role="alert">{cameraError}</p>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />

        <div className="notes-actions">
          {!cameraActive ? (
            <button className="btn btn--primary notes-actions__main" onClick={startCamera}>
              📷 Open Camera
            </button>
          ) : (
            <>
              <button className="btn btn--primary notes-actions__main" onClick={captureNote}>
                {captured ? '✅ Saved!' : '📸 Capture'}
              </button>
              <button className="btn btn--ghost notes-actions__stop" onClick={stopCamera}>
                ✕ Close
              </button>
            </>
          )}
        </div>
      </section>

      {/* ── Saved notes gallery ─────────────────── */}
      <section className="section">
        <div className="notes-gallery-header">
          <h2 className="section__title">
            Saved Notes {notes.length > 0 && <span className="notes-count">{notes.length}</span>}
          </h2>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__icon">🗒️</p>
            <p className="empty-state__text">No notes yet</p>
            <p className="empty-state__sub">Open the camera to capture your first note</p>
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );

  async function handleDeleteNote(id) {
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  }
}
