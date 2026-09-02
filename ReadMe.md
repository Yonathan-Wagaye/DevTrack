# DevTrack - Personal Developer Task Manager

A productivity dashboard for developers to manage tasks and track GitHub commits.



## Getting Started (Docker)

From the repo root, start the frontend, backend, and Postgres:

```bash
docker compose --env-file server/.env up --build
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **Postgres:** localhost:5432

Stop everything:

```bash
docker compose --env-file server/.env down
```

Follow logs:

```bash
docker compose --env-file server/.env logs -f
```

### First-time setup

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Copy the env template and fill in real values:

```bash
cp server/.env.example server/.env
```

3. Run the `docker compose up` command above.

`--env-file` loads `server/.env` so Compose can interpolate database credentials. For local Vite (`npm run dev`), copy `client/.env.example` to `client/.env` as well.

## Local development (without Docker for the apps)

Use this when you want hot reload. Postgres can still run in Docker.

### Prerequisites

- Node.js (v18 or higher)
- npm
- Docker (for the database)

### Installation

```bash
cd client && npm install
cd ../server && npm install
```

Start Postgres:

```bash
cd server
npm run db:up
```

Start the apps in two terminals:

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Project Structure

```
DevTrack/
├── client/                 # React frontend
│   ├── Dockerfile
│   ├── nginx.conf          # Serves the built app and proxies /api
│   ├── src/
│   └── package.json
├── server/                 # Node.js backend
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── docker-compose.yml      # Frontend + backend + Postgres
└── README.md
```
