# Notable — Markdown Note Taking App

A full-stack markdown note taking app with AI-powered grammar checking. Write notes in markdown, render them beautifully, and get instant grammar feedback powered by Claude.

---

## Overview

Notable is a personal project built to explore full-stack development with Django and React. The backend was designed and built independently, handling authentication, file-based note storage, markdown rendering, and AI grammar checking. The frontend was built in React with Tailwind CSS in collaboration with Claude — a fun first experience with React that made the process much more enjoyable.

---

## Features

- JWT-based user authentication (register, login, logout)
- Create, edit, and delete notes written in markdown
- Notes stored as `.md` files on disk
- Markdown rendered to HTML in the browser
- AI-powered grammar checking via Claude API
- Sidebar layout with live search/filter
- Clean dark UI built with React and Tailwind CSS

---

## Tech Stack

**Backend**
- Python, Django, Django REST Framework
- Simple JWT for authentication
- Notes stored as `.md` files on disk
- Markdown-to-HTML conversion
- Claude API for grammar checking

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios for API requests
- React Router for navigation

---

## System Architecture

> Architecture diagram coming soon.

---

## Project Structure

```
markdown-note-taking-app/
├── backend/
│   ├── notes/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── utils/
│   │       ├── markdown_utils.py
│   │       └── grammar_utils.py
│   ├── auth/
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NoteList.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip / uv

### 1. Clone the repository

```bash
git clone https://github.com/your-username/markdown-note-taking-app.git
cd markdown-note-taking-app
```

### 2. Set up the backend

```bash
cd backend
uv sync
cp .env.example .env
```

Edit `.env` with your credentials and Claude API key.

```bash
python manage.py migrate
python manage.py runserver
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login and receive JWT tokens |
| POST | `/api/auth/logout/` | Logout and blacklist refresh token |
| GET | `/api/notes/` | List all notes for the logged-in user |
| POST | `/api/notes/save/` | Create a new note |
| GET | `/api/notes/:id/` | Get a single note |
| PUT | `/api/notes/:id/edit/` | Update a note |
| DELETE | `/api/notes/:id/delete/` | Delete a note |
| GET | `/api/notes/:id/render/` | Render note markdown to HTML |
| GET | `/api/notes/:id/grammar/` | Run AI grammar check on a note |

---

## How Notes Are Stored

Notes are not stored as text in the database. Instead, each note is saved as a `.md` file on disk when created. The database row stores the title, a reference to the file path, the owner, and the timestamp. When a note is read, edited, or rendered, the file is read directly from disk. When a note is deleted, the file is removed from disk before the database row is deleted.

---

## Development Notes

The backend was fully designed and built independently — models, serializers, views, authentication, file handling, and AI integration. The frontend was built in React which was a first time experience for me, in collaboration with Claude, which made the experience both productive and enjoyable. Tailwind CSS was used throughout for styling, with a minimal aesthetic as the design.

---

## Author

Mazen — backend engineering & project design  
Frontend built in collaboration with Claude (Anthropic)