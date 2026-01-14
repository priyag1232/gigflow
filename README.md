# GigFlow

Mini freelance marketplace (full-stack example)

## Overview
Backend: Node, Express, MongoDB (Mongoose), JWT in HttpOnly cookies, Socket.io
Frontend: React (Vite), Tailwind, Redux Toolkit, Axios

## Quick start

Prerequisites:
- Node.js (16+)
- MongoDB running locally or a connection string

1) Backend

```powershell
cd backend
npm install
# copy .env.example to .env and set MONGO_URI and JWT_SECRET
npm run dev
```

2) Frontend

```powershell
cd frontend
npm install
# Optional: set VITE_API_URL in .env
npm run dev
```

API server defaults to http://localhost:4000 and frontend runs at http://localhost:5173.

## Notes
- Authentication uses JWT stored in HttpOnly cookie named `token`.
- Socket.io uses the same cookie for authenticating socket connections.
- Hiring uses a MongoDB transaction to atomically update gig and bids.

See `backend` and `frontend` folders for implementation details.
