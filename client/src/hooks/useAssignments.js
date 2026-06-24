import { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import axiosClient from '../api/axiosClient.js';
import { cacheAssignments, getCachedAssignments } from '../services/idb.js';

export function useAssignments() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const cached = await getCachedAssignments();
        if (Array.isArray(cached) && cached.length && !cancelled) {
          dispatch({ type: 'SET_ASSIGNMENTS', payload: cached });
        }
      } catch { /* IndexedDB unavailable */ }

      try {
        const { data } = await axiosClient.get('/assignments');
        if (!cancelled) {
          dispatch({ type: 'SET_ASSIGNMENTS', payload: data });
          if (Array.isArray(data)) await cacheAssignments(data);
        }
      } catch (err) {
        console.error('Failed to fetch assignments:', err.message);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const addAssignment = async (assignmentData) => {
    const { data } = await axiosClient.post('/assignments', assignmentData);
    dispatch({ type: 'ADD_ASSIGNMENT', payload: data });
    return data;
  };

  const toggleAssignment = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const original = state.assignments.find(a => a._id === id);
    dispatch({ type: 'UPDATE_ASSIGNMENT', payload: { ...original, status: newStatus } });
    try {
      const { data } = await axiosClient.patch(`/assignments/${id}`, { status: newStatus });
      dispatch({ type: 'UPDATE_ASSIGNMENT', payload: data });
    } catch (err) {
      dispatch({ type: 'UPDATE_ASSIGNMENT', payload: original });
      throw err;
    }
  };

  const deleteAssignment = async (id) => {
    dispatch({ type: 'DELETE_ASSIGNMENT', payload: id });
    try {
      await axiosClient.delete(`/assignments/${id}`);
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const safeAssignments = Array.isArray(state.assignments) ? state.assignments : [];
  const now = new Date();
  const filtered = safeAssignments.filter(a => {
    const due = new Date(a.dueDate);
    if (state.assignmentFilter === 'pending')   return a.status === 'pending' && due >= now;
    if (state.assignmentFilter === 'completed') return a.status === 'completed';
    if (state.assignmentFilter === 'overdue')   return a.status === 'pending' && due < now;
    return true;
  });

  return {
    assignments: state.assignments,
    filtered,
    filter: state.assignmentFilter,
    setFilter: (f) => dispatch({ type: 'SET_FILTER', payload: f }),
    addAssignment,
    toggleAssignment,
    deleteAssignment
  };
}
