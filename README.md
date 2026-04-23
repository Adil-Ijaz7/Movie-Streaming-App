# Movie Streaming App

A full-stack movie and TV streaming discovery app inspired by Max/HBO. Browse trending titles, explore movies and series, manage a watchlist, and stream content via third-party embed players — all powered by the TMDB API.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Backend setup](#2-backend-setup)
  - [3. Frontend setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
  - [Development](#development)
  - [Production build](#production-build)
- [Running Tests](#running-tests)
- [Lint & Format (Backend)](#lint--format-backend)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This app lets users sign in (demo — no real credentials required), choose a profile, and browse a rich catalogue of movies and TV shows fetched live from [The Movie Database (TMDB)](https://www.themoviedb.org/). Clicking a title opens a detail page with trailers, cast information, and an embedded video player backed by several streaming servers.

## Features

- 🎬 Browse trending, popular, top-rated, upcoming, and Bollywood/Hindi content
- 📺 HBO / Max originals section
- 🔍 Full-text search across movies and TV shows
- 📋 Per-profile watchlist (persisted in `localStorage`)
- ▶️ Watch via multiple embed servers (111movies, VidSrc, VidLink, 2Embed, Videasy)
- 👤 Multiple profile support
- 🌙 Dark-themed UI built with Tailwind CSS + Radix UI

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 19, React Router v7, Tailwind CSS, Radix UI, Axios, CRACO |
| Backend  | Python 3, FastAPI, Uvicorn, Motor (async MongoDB driver) |
| Database | MongoDB |
| API      | TMDB (The Movie Database) |

## Prerequisites

Make sure the following are installed before you begin:

- **Node.js** ≥ 18 and **Yarn** 1.x  
  `node --version` / `yarn --version`
- **Python** ≥ 3.10  
  `python3 --version`
- **MongoDB** — a running instance (local or cloud, e.g. [MongoDB Atlas](https://www.mongodb.com/atlas))

> **Note:** The frontend fetches data directly from TMDB using API keys that are already included in the source code (`frontend/src/lib/tmdb.js`). No additional TMDB account is required to run the app.

## Project Structure

```
Movie-Streaming-App/
├── backend/
│   ├── server.py          # FastAPI application entry-point
│   └── requirements.txt   # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/    # Navbar, Hero, MediaRow, etc.
    │   ├── context/       # AuthContext (localStorage-based auth)
    │   ├── hooks/
    │   ├── lib/           # TMDB API client, utilities
    │   └── pages/         # Route-level page components
    ├── public/
    ├── package.json
    └── tailwind.config.js
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Adil-Ijaz7/Movie-Streaming-App.git
cd Movie-Streaming-App
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file with your configuration (see Environment Variables below)
cp /dev/null .env               # or just create the file manually
```

### 3. Frontend setup

```bash
cd frontend

# Install dependencies
yarn install
```

## Environment Variables

### Backend (`backend/.env`)

Create a file named `.env` inside the `backend/` directory with the following variables:

```env
# Required — MongoDB connection string
MONGO_URL=mongodb://localhost:27017

# Required — Name of the MongoDB database to use
DB_NAME=movie_streaming_app

# Optional — Comma-separated list of allowed CORS origins (defaults to * if unset)
CORS_ORIGINS=http://localhost:3000
```

| Variable       | Required | Description |
|----------------|----------|-------------|
| `MONGO_URL`    | ✅ Yes   | Full MongoDB connection URI (local or Atlas) |
| `DB_NAME`      | ✅ Yes   | MongoDB database name |
| `CORS_ORIGINS` | ❌ No    | Comma-separated origins allowed by CORS middleware. Defaults to `*` |

The backend loads this file automatically via `python-dotenv`.

> **MongoDB Atlas example:**  
> `MONGO_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority`

## Running the App

### Development

Start **both** services in separate terminals:

**Terminal 1 — Backend**

```bash
cd backend
source venv/bin/activate        # Windows: venv\Scripts\activate
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive API docs: `http://localhost:8000/docs`

**Terminal 2 — Frontend**

```bash
cd frontend
yarn start
```

The React dev server starts at `http://localhost:3000` and automatically proxies nothing — it calls TMDB and the backend directly.

### Production build

**Frontend**

```bash
cd frontend
yarn build
```

This creates an optimized static bundle in `frontend/build/` which can be served by any static host (Nginx, Vercel, Netlify, etc.).

**Backend**

Run Uvicorn without `--reload` and optionally increase workers:

```bash
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

## Running Tests

**Frontend**

```bash
cd frontend
yarn test
```

Launches the Create React App / CRACO test runner (Jest) in interactive watch mode. Press `a` to run all tests.

**Backend**

```bash
cd backend
source venv/bin/activate
pytest
```

> The backend `tests/` directory currently contains only an `__init__.py` placeholder. Add test files alongside it as the project grows.

## Lint & Format (Backend)

The following tools are included in `requirements.txt`:

```bash
cd backend
source venv/bin/activate

# Lint with flake8
flake8 server.py

# Auto-format with black
black server.py

# Sort imports with isort
isort server.py

# Type-check with mypy
mypy server.py
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `KeyError: 'MONGO_URL'` on backend start | Missing `.env` file | Create `backend/.env` with `MONGO_URL` and `DB_NAME` set |
| Frontend shows blank media rows | TMDB API rate-limit or key rotation | Wait a moment and refresh; the app rotates between two built-in keys automatically |
| CORS error in browser | `CORS_ORIGINS` misconfigured | Add `http://localhost:3000` to `CORS_ORIGINS` in `backend/.env` |
| `yarn: command not found` | Yarn not installed | Run `npm install -g yarn` |
| Port 3000 already in use | Another process is using the port | Set `PORT=3001 yarn start` or kill the conflicting process |
| Port 8000 already in use | Another process is using the port | Run Uvicorn on a different port: `uvicorn server:app --port 8001` |
| Videos not playing | Embed server blocked by browser/ISP | Switch servers using the server selector on the detail page |

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request against `main`

Please keep PRs focused and include a clear description of what was changed and why.

## License

License: Not specified.
