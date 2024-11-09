import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'; // Tailwind or global styles
import App from './App';
import Login from './pages/auth/LoginPage';
import Signup from './pages/auth/SignUpPage';
import { UserProvider, useUser } from './context/UserContext'; // Import useUser
import ViewProfilePage from './pages/ViewProfilePage';
import ViewAllPosts from './pages/ViewAllPosts';
import ViewMyPostsPage from './pages/ViewMyPostsPage';
import Sidebar from './components/Sidebar';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const MainApp = () => {
  const { user } = useUser(); // Access the authentication status

  return (
    <Router>
      <div className="flex">  
        {/* Conditionally render Sidebar if user is authenticated */}
        {user && <Sidebar />}

        <div className="flex-grow">
          <Routes>
            {/* Public routes: Login and Signup */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes: Check if user is authenticated before rendering */}
            <Route
              path="/home"
              element={user ? <App /> : <Navigate to="/" replace />} // Redirect to login if not authenticated
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

            {/* Redirect any unknown paths to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <UserProvider>
    <React.StrictMode>
      <MainApp />
    </React.StrictMode>
  </UserProvider>
);
