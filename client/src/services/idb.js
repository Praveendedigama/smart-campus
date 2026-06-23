import { openDB } from 'idb';

const DB_NAME = 'smart-campus-db';
const DB_VERSION = 1;

const getDB = () =>
  openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('lectures')) {
        db.createObjectStore('lectures', { keyPath: '_id' });
      }
      if (!db.objectStoreNames.contains('assignments')) {
        db.createObjectStore('assignments', { keyPath: '_id' });
      }
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
    }
  });

export const cacheLectures = async (lectures) => {
  const db = await getDB();
  const tx = db.transaction('lectures', 'readwrite');
  await tx.store.clear();
  await Promise.all(lectures.map(l => tx.store.put(l)));
  await tx.done;
};

export const getCachedLectures = async () => {
  const db = await getDB();
  return db.getAll('lectures');
};

export const cacheAssignments = async (assignments) => {
  const db = await getDB();
  const tx = db.transaction('assignments', 'readwrite');
  await tx.store.clear();
  await Promise.all(assignments.map(a => tx.store.put(a)));
  await tx.done;
};

export const getCachedAssignments = async () => {
  const db = await getDB();
  return db.getAll('assignments');
};

export const saveNote = async (note) => {
  const db = await getDB();
  const id = Date.now();
  const record = { ...note, id, savedAt: new Date().toISOString() };
  await db.put('notes', record);
  return record;
};

export const getNotes = async () => {
  const db = await getDB();
  return db.getAll('notes');
};

export const deleteNote = async (id) => {
  const db = await getDB();
  return db.delete('notes', id);
};
