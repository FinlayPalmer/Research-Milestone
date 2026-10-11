# React Firebase Dashboard

A full-stack web application built with **React, Firebase, and Python FastAPI**. The application includes user authentication, a dashboard, an AI chat interface, and a mock online store.

## Technologies Used

- **React + Vite:** Frontend
- **Firebase:** User authentication
- **Python + FastAPI:** Backend API
- **CSS:** Styling
- **Lucide React:** Icons

## Features

### Authentication
- Email/password login and signup
- Google Sign-In
- User session management

### Dashboard
- Responsive sidebar navigation
- User profile and account information
- Overview, activity, and settings pages

### AI Chat
- React chat interface connected to a Python FastAPI backend
- HTTP requests between the frontend and backend
- Simulated AI responses without a real model
- Backend connection status

### Store
- Product browsing and search
- Category filtering
- Shopping cart with quantity management
- Mock checkout functionality

## Project Structure

```text
my-app/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── src/
│   ├── components/
│   │   ├── AIChat.jsx
│   │   └── Store.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── AIChat.css
│   ├── Store.css
│   ├── auth.js
│   └── firebase.js
└── package.json
```

## Current Status

This application is a working prototype. Firebase handles authentication, while the Python backend provides mock AI responses. The store uses sample products and simulated purchases.

## Future Development

- Integrate a real AI model
- Add Firestore database storage
- Implement real payment processing
- Save chat and order history
- Deploy the application