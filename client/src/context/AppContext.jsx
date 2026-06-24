import { createContext, useContext, useReducer, useEffect } from 'react';
import axiosClient from '../api/axiosClient.js';
import { getCachedAssignments, cacheAssignments } from '../services/idb.js';

const initialState = {
  assignments: [],
  assignmentFilter: 'all',
  profile: null,
  isOnline: navigator.onLine
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: Array.isArray(action.payload) ? action.payload : [] };
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [action.payload, ...state.assignments] };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(a =>
          a._id === action.payload._id ? action.payload : a
        )
      };
    case 'DELETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter(a => a._id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, assignmentFilter: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const preload = async () => {
      try {
        const cached = await getCachedAssignments();
        if (Array.isArray(cached) && cached.length) {
          dispatch({ type: 'SET_ASSIGNMENTS', payload: cached });
        }
      } catch { /* IndexedDB unavailable — skip cache */ }

      try {
        const { data } = await axiosClient.get('/assignments');
        dispatch({ type: 'SET_ASSIGNMENTS', payload: data });
        if (Array.isArray(data)) await cacheAssignments(data);
      } catch { /* network offline — cached data already shown */ }
    };
    preload();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
