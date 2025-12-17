# 🐶 Dog Gallery App

A modern, responsive Dog Gallery application built with **React + FastAPI**.

---

## 🚀 Live Demo
- Frontend: https://dog-gallery-app-six.vercel.app
- Backend API: https://dog-gallery-app-8ry6.onrender.com
- Swagger Docs: https://dog-gallery-app-8ry6.onrender.com/docs

---

## 🛠 Tech Stack

### Frontend
- React (Vite)  
- Bootstrap
- Axios
- React Router

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Dog CEO API

---

## ✨ Features

### 🐕 Dog Breed Listing
- Fetches all dog breeds
- Responsive grid layout
- Search, filter & sort
- Pagination support

### 📸 Breed Detail Page
- View breed images
- Infinite load (Load More)
- Image zoom on click

### ❤️ Like Feature
- Like / unlike images
- Persisted in database
- View all liked images

### 🔗 Share Feature
- Web Share API
- Copy link fallback
- Shareable URLs

### 👀 Recently Viewed
- Tracks last 5 viewed breeds
- Stored in database
- Horizontal scroll view

### 🌙 Dark Mode
- Default dark mode
- Persisted UI theme

### ⚠ Error & Loading Handling
- Loading spinners
- Retry buttons
- Graceful empty states

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|------|---------|------------|
| GET | / | Health check |
| POST | /like | Like image |
| DELETE | /like | Unlike image |
| GET | /likes | Get liked images |
| POST | /viewed | Add viewed breed |
| GET | /viewed | Get recent breeds |
| GET | /stats/liked-breeds | Like statistics |

---

## 🧑‍💻 Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

### Backend
```bash
cd frontend
cd dog-gallery-ui
npm install
npm run dev