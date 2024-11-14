import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'; 
import App from './App';
import Login from './pages/auth/LoginPage';
import Signup from './pages/auth/SignUpPage';
import { UserProvider, useUser } from './context/UserContext'; 
import ViewProfilePage from './pages/ViewProfilePage';
import ViewAllPosts from './pages/ViewAllPosts';
import ViewMyPostsPage from './pages/ViewMyPostsPage';
import Sidebar from './components/Sidebar';
import Modal from 'react-modal';

// Import the Google OAuth provider
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DarkModeProvider } from './context/DarkModeContext';

Modal.setAppElement('#root');

// Main App Component that handles route rendering and logic
const MainApp = () => {
  const { user } = useUser(); // Accessing user context

  return (
    <Router>
      <div className="flex">
        {/* Conditionally render Sidebar based on user login state */}
        {user && <Sidebar />}

        <div className="flex-grow">
          <Routes>
            {/* Handle login redirect if user is already logged in */}
            <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />

            {/* Protected routes that require the user to be logged in */}
            <Route
              path="/home"
              element={user ? <App /> : <Navigate to="/" replace />} 
            />
            <Route
              path="/profile"
              element={user ? <ViewProfilePage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/viewall"
              element={user ? <ViewAllPosts /> : <Navigate to="/" replace />}
            />
            <Route
              path="/viewmyposts"
              element={user ? <ViewMyPostsPage /> : <Navigate to="/" replace />}
            />

            {/* Catch-all route for non-matching paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// Entry point rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap your application with GoogleOAuthProvider
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
  <DarkModeProvider>
    <UserProvider>
      <React.StrictMode>
        <MainApp />
      </React.StrictMode>
    </UserProvider>
    </DarkModeProvider>
  </GoogleOAuthProvider>
);
