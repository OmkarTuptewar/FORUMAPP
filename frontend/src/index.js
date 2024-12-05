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
import TouristPage from './category/TouristPage';
import TravelPage from './category/TravelPage';
import StudentPage from './category/StudentPage';
import VisaPage from './category/VisaPage';
import WeeklynewsPage from './category/WeeklynewsPage';
import ViewAll from './pages/ViewAll';

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
    {/* Login redirect */}
    <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
    <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />

    {/* Protected Routes */}
    <Route
      path="/home"
      element={user ? <App /> : <Navigate to="/" replace />}
    />
    <Route
      path="/profile"
      element={user ? <ViewProfilePage /> : <Navigate to="/" replace />}
    />

     <Route
      path="/ViewAll"
      element={user ? <ViewAll /> : <Navigate to="/" replace />}
    />

    
    <Route
      path="/viewall"
      element={user ? <ViewAllPosts /> : <Navigate to="/" replace />}
    />
    <Route
      path="/viewmyposts"
      element={user ? <ViewMyPostsPage /> : <Navigate to="/" replace />}
    />


      {/* categories section Routes */}
    <Route
      path="/studentpage"
      element={user ? <StudentPage /> : <Navigate to="/" replace />}
    />

    <Route
      path="/touristpage"
      element={user ? <TouristPage /> : <Navigate to="/" replace />}
    />
     <Route
      path="/travelpage"
      element={user ? <TravelPage /> : <Navigate to="/" replace />}
    />
     <Route
      path="/visapage"
      element={user ? <VisaPage/> : <Navigate to="/" replace />}
    />
     <Route
      path="/weeklynewspage"
      element={user ? <WeeklynewsPage /> : <Navigate to="/" replace />}
    />

    {/* Redirect non-matching routes */}
    <Route path="*" element={<Navigate to="/signup" replace />} />
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
