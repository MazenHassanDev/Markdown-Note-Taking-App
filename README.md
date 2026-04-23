# Notable — Markdown Note Taking App

A full-stack markdown note taking app with AI-powered grammar checking. Write notes in markdown, render them beautifully, and get instant grammar feedback powered by Claude.

**Live Demo**
- Frontend: https://enchanting-connection-production-97b4.up.railway.app
- Backend API: https://markdown-note-taking-app-production-8e94.up.railway.app

---

## Overview

Notable is a personal project built to explore full-stack development with Django and React. The backend was designed and built independently, handling JWT authentication, file-based note storage, markdown rendering, and AI grammar checking via the Claude API. The frontend was built in React with Tailwind CSS with the help of Claude — as I am solely focusing on the backend engineering part of the project (still trying to learn React).
The app is fully containerised with Docker and deployed on Railway with a managed MySQL database.

---

## Features

- JWT-based user authentication (register, login, logout with token blacklisting)
- Create, edit, and delete notes written in markdown
- Notes stored as `.md` files on disk, metadata stored in MySQL
- Markdown rendered to HTML via the API
- AI-powered grammar checking via Claude API (claude-opus-4-6)
- Live note search and filter by title
- Token persisted in localStorage with automatic Authorization header injection
- Route protection — unauthenticated users are redirected to login
- Clean dark UI with fade-in animations built with React and inline styles

---

## Tech Stack

**Backend**
- Python 3.14, Django 6, Django REST Framework
- MySQL database
- SimpleJWT for authentication (access + refresh tokens, token blacklisting)
- Notes stored as `.md` files on disk, referenced by path in the database
- `markdown2` for markdown-to-HTML conversion
- `anthropic` SDK for grammar checking via Claude API (claude-opus-4-6)

**Frontend**
- React 18 (Vite)
- React Router for client-side navigation
- Axios with request interceptor for automatic JWT injection
- Inline styles + Google Fonts (DM Sans, Playfair Display)

**Infrastructure**
- Docker & Docker Compose for local containerisation
- Backend: `python:3.14-slim` image, migrations run automatically on container start
- Frontend: `node:24-slim` image, Vite dev server with `--host` flag
- Deployed on Railway (backend + frontend as separate services)
- MySQL managed by Railway

---

## System Architecture

```
Frontend (React/Vite)
      ↓ HTTP requests via Axios (JWT injected automatically)
Backend (Django REST Framework)
      ↓ queries
MySQL Database (note metadata: title, file path, owner, timestamps)
      ↓ file I/O
.md files on disk (actual note content)
      ↓ API calls
Claude API (grammar checking via claude-opus-4-6)
```

---

## Project Structure

```
markdown-note-taking-app/
├── backend/
│   ├── notes/
│   │   ├── models.py               # Note model (user, title, file, created_at)
│   │   ├── serializers.py          # NoteSerializer, NoteUpdateSerializer
│   │   ├── views.py                # list, save, get, update, delete, render, grammar
│   │   ├── urls.py
│   │   ├── tests.py                # Authenticated/unauthenticated note tests
│   │   └── utils/
│   │       ├── markdown_utils.py   # convert_to_html, strip_markdown
│   │       └── grammar_utils.py    # Claude API grammar check
│   ├── users/
│   │   ├── serializers.py          # RegisterSerializer with validation
│   │   ├── views.py                # register, logout
│   │   ├── urls.py
│   │   └── tests.py                # Register, login, logout tests
│   ├── notes_backend/
│   │   ├── settings.py             # All config via environment variables
│   │   └── urls.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios instance with JWT interceptor
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NoteList.jsx
│   │   ├── App.jsx                 # Routes + token-based redirect logic
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind base imports
│   ├── Dockerfile
│   ├── vite.config.js
│   └── index.html
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- Docker & Docker Compose (recommended)
- Or: Python 3.14+, Node.js 24+, MySQL

---

### Option A — Run with Docker (recommended)

**1. Clone the repository**

```bash
git clone https://github.com/your-username/markdown-note-taking-app.git
cd markdown-note-taking-app
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your credentials and Claude API key.

**3. Start all services**

```bash
docker-compose up --build
```

This starts three containers: Django backend, React frontend, and MySQL. Migrations run automatically on backend startup.

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

---

### Option B — Run manually

**1. Clone the repository**

```bash
git clone https://github.com/MazenHassanDev/Markdown-Note-Taking-App.git
cd markdown-note-taking-app
```

**2. Set up the backend**

```bash
cd backend
uv sync
cp .env.example .env
uv run python manage.py migrate
uv run python manage.py runserver
```

**3. Set up the frontend**

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Environment Variables

Create a `.env` file at the root of the project:

```bash
# Django
SECRET_KEY=your-secret-key
DEBUG_STATUS=1
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=notes_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=db
DB_PORT=3306

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

`DB_HOST=db` refers to the MySQL service name in Docker Compose. Change to `localhost` when running manually.

---

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | None | Register a new user |
| POST | `/api/auth/login/` | None | Login and receive access + refresh tokens |
| POST | `/api/auth/token/refresh/` | None | Refresh access token |
| POST | `/api/auth/logout/` | Required | Logout and blacklist refresh token |

### Notes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notes/` | Required | List all notes for the logged-in user |
| GET | `/api/notes/?term=query` | Required | Search notes by title |
| POST | `/api/notes/save/` | Required | Create a new note |
| GET | `/api/notes/:id/` | Required | Get a single note with content |
| PUT | `/api/notes/:id/edit/` | Required | Update a note's title and content |
| DELETE | `/api/notes/:id/delete/` | Required | Delete a note and its file from disk |
| GET | `/api/notes/:id/render/` | Required | Render note markdown to HTML |
| GET | `/api/notes/:id/grammar/` | Required | Run AI grammar check on a note |

---

## How Notes Are Stored

Notes are not stored as text in the database. Instead, each note is saved as a `.md` file on disk when created, with a UUID-prefixed filename to avoid collisions. The database row stores the title, a reference to the file path, the owner, and the timestamp. When a note is read, edited, or rendered, the file is read directly from disk. When a note is deleted, the file is removed from disk before the database row is deleted.

---

## Running Tests

```bash
cd backend
uv run python manage.py test
```

Tests cover:

**Auth (users/tests.py)**
- Successful registration returns 201
- Duplicate username returns 400
- Password under 8 characters returns 400
- Valid login returns access and refresh tokens
- Wrong password returns 401
- Non-existent username returns 401
- Logout blacklists refresh token and returns 200
- Logout with invalid token returns 400

**Notes (notes/tests.py)**
- Unauthenticated GET returns 401
- Authenticated GET returns 200
- Create note returns 201
- Create note with missing content returns 400
- Delete note returns 204
- Delete another user's note returns 404

---

## Development Notes

The backend was fully designed and built independently — models, serializers, views, authentication, file handling, and AI integration. The frontend was built in React which was a first time experience, being transparent I had to use Claude's assistance, which made the experience both productive and enjoyable. The UI was designed with a minimal dark aesthetic using inline styles, DM Sans for body text, and Playfair Display for headings.

---

## Author

Mazen — backend engineering, Docker setup & project design  
