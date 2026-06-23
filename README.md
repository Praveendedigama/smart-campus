# Smart Campus Web Companion

A mobile-first Progressive Web App for university students to manage daily academic life.

## Framework & Stack

- **Frontend:** React 18 + Vite, React Router v6, plain CSS3 (mobile-first)
- **Backend:** Node.js + Express, Mongoose, MongoDB Atlas
- **Storage:** LocalStorage (preferences/profile cache) + IndexedDB via `idb` (offline data, captured note images)
- **Web APIs:** Notification API (deadline reminders), HTML5 Camera API (lecture notes capture)

## Browser Compatibility

Tested on:
- **Chrome 120+** — recommended for full Camera & Notification API support
- Firefox 121+
- Safari 17+ (Camera API requires HTTPS in production; works on localhost)

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier) **or** local MongoDB running on port 27017

## Getting Started (localhost)

**1. Install dependencies:**
```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

**2. Configure environment:**
```bash
cp server/.env.example server/.env
```
Edit `server/.env` and set your MongoDB connection string:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smart-campus
PORT=5000
```
For local MongoDB use: `MONGO_URI=mongodb://localhost:27017/smart-campus`

**3. Seed the database with sample data:**
```bash
cd server && node seed/seedData.js && cd ..
```

**4. Start development servers:**
```bash
npm run dev
```
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

**5. Open in browser:**

Navigate to http://localhost:5173, open DevTools (F12) → Device Toolbar, and select a mobile viewport (iPhone 12 / Pixel 7 recommended).

## Project Structure

```
smart-campus/
├── server/          Express REST API + MongoDB
│   ├── models/      Mongoose schemas
│   ├── controllers/ Route handlers
│   ├── routes/      Express routers
│   └── seed/        Sample data
└── client/          React SPA
    └── src/
        ├── api/         Axios client
        ├── context/     Global state (Context + useReducer)
        ├── hooks/       Custom data hooks
        ├── services/    IndexedDB + Notifications
        ├── components/  Reusable UI components
        └── pages/       Route-level pages
```
