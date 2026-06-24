import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient.js';
import { cacheLectures, getCachedLectures } from '../services/idb.js';

export function useLectures() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let hasData = false;

    const load = async () => {
      const cached = await getCachedLectures();
      if (cached.length && !cancelled) {
        setLectures(cached);
        hasData = true;
        setLoading(false);
      }

      try {
        const { data } = await axiosClient.get('/lectures/today');
        const safeData = Array.isArray(data) ? data : [];
        if (!cancelled) {
          setLectures(safeData);
          setError(null);
          await cacheLectures(safeData);
        }
      } catch (err) {
        if (!cancelled && !hasData) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return { lectures, loading, error };
}
