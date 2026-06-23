import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useToast } from '../context/ToastContext.jsx';
import axiosClient from '../api/axiosClient.js';
import ProgressRing from '../components/ProgressRing.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';

export default function Profile() {
  const { dispatch } = useApp();
  const addToast = useToast();
  const [cached, setCached] = useLocalStorage('sc_profile', null);
  const [profile, setProfile] = useState(cached);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(!cached);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosClient.get('/profile');
        setProfile(data);
        setCached(data);
        dispatch({ type: 'SET_PROFILE', payload: data });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const startEdit = () => {
    setForm({ ...profile });
    setEditing(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.studentName?.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    try {
      const { data } = await axiosClient.put('/profile', form);
      setProfile(data);
      setCached(data);
      dispatch({ type: 'SET_PROFILE', payload: data });
      addToast('Profile saved!', 'success');
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleField = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  if (loading) return <div className="page"><Loader text="Loading profile…" /></div>;

  const pct = profile
    ? Math.round((profile.completedCredits / profile.totalCreditsRequired) * 100)
    : 0;

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">My Profile</h1>
        {!editing && profile && (
          <button className="btn btn--ghost" onClick={startEdit}>Edit</button>
        )}
      </header>

      {error && !editing && <ErrorBanner message={error} />}

      {profile && (
        <div className="card profile-card">
          <div className="profile-card__top">
            <div className="profile-card__avatar" aria-hidden="true">
              {(profile.studentName?.[0] || 'S').toUpperCase()}
            </div>
            <div>
              <h2 className="profile-card__name">{profile.studentName}</h2>
              <p className="profile-card__id">{profile.studentId}</p>
              {profile.email && <p className="profile-card__email">{profile.email}</p>}
            </div>
          </div>

          <ProgressRing
            completed={profile.completedCredits}
            total={profile.totalCreditsRequired}
            size={140}
          />
          <p className="profile-card__pct">{pct}% complete</p>

          <div className="profile-card__stats">
            <div className="stat">
              <span className="stat__value">{profile.completedCredits}</span>
              <span className="stat__label">Earned</span>
            </div>
            <div className="stat">
              <span className="stat__value">{profile.totalCreditsRequired - profile.completedCredits}</span>
              <span className="stat__label">Remaining</span>
            </div>
            <div className="stat">
              <span className="stat__value">{profile.enrolledCourses?.length || 0}</span>
              <span className="stat__label">Courses</span>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <form className="card form" onSubmit={handleSave} noValidate>
          <h2 className="form__title">Edit Profile</h2>

          <div className="field">
            <label className="field__label" htmlFor="p-name">Full Name *</label>
            <input
              id="p-name"
              type="text"
              className="field__input"
              value={form.studentName || ''}
              onChange={handleField('studentName')}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-id">Student ID</label>
            <input
              id="p-id"
              type="text"
              className="field__input"
              value={form.studentId || ''}
              onChange={handleField('studentId')}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-email">Email</label>
            <input
              id="p-email"
              type="email"
              className="field__input"
              value={form.email || ''}
              onChange={handleField('email')}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-completed">Completed Credits</label>
            <input
              id="p-completed"
              type="number"
              className="field__input"
              min={0}
              max={form.totalCreditsRequired || 120}
              value={form.completedCredits ?? 0}
              onChange={e => setForm(f => ({ ...f, completedCredits: Number(e.target.value) }))}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-total">Total Credits Required</label>
            <input
              id="p-total"
              type="number"
              className="field__input"
              min={1}
              value={form.totalCreditsRequired ?? 120}
              onChange={e => setForm(f => ({ ...f, totalCreditsRequired: Number(e.target.value) }))}
            />
          </div>

          {error && <p className="form__error" role="alert">{error}</p>}

          <div className="form__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => { setEditing(false); setError(''); }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
