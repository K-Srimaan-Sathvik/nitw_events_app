# Node.js + Express + Vite Frontend Export

This package contains the Node.js + Express backend and the Vite React frontend, ready to import into Cursor.

## Structure
- backend/ — Express server, Sequelize models, routes, seed script
- frontend/ — Vite React app
- docker-compose.yml — Dev stack: Postgres + backend + frontend

## Quick start (without Docker)
1) Ensure Postgres is running locally (or set DB env to a remote DB)
2) Backend
```
cd backend
cp ../.env.example .env  # then edit values
npm install
npm run seed
npm run dev
```
3) Frontend
```
cd ../frontend
npm install
npm run dev
```
4) Open http://localhost:5173

## Quick start (with Docker)
```
docker compose up -d
```
Frontend: http://localhost:5173
Backend:  http://localhost:4000 (health at /health)

## Environment
Copy `.env.example` to `.env` in project root to use docker-compose or to `backend/.env` for local runs.
