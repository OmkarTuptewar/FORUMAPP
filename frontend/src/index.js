import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DarkModeProvider } from './context/DarkModeContext';
import TouristPage from './category/TouristPage';
import TravelPage from './category/TravelPage';
import StudentPage from './category/StudentPage';
import VisaPage from './category/VisaPage';
import WeeklynewsPage from './category/WeeklynewsPage';
import ViewAll from './pages/ViewAll';
import GroupPage from './groupssection/GroupPage';
import GroupDetailPage from './groupssection/GroupDetailPage';
import Header from './components/Header';

Modal.setAppElement('#root');

// ProtectedRoute Component
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

const MainApp = () => {
  const { user } = useUser(); // Accessing user context
  const location = useLocation(); // Get the current location

  // Check if current route is login or signup page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex">
      {/* Conditionally render Sidebar based on current route */}
      {!isAuthPage && <Sidebar />}
      

      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<App />} />
          <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />
          <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={<ProtectedRoute user={user}><ViewProfilePage /></ProtectedRoute>}
          />
          <Route
            path="/viewallpost"
            element={<ProtectedRoute user={user}><ViewAllPosts /></ProtectedRoute>}
          />
          <Route
            path="/viewmyposts"
            element={<ProtectedRoute user={user}><ViewMyPostsPage /></ProtectedRoute>}
          />
          <Route
            path="/studentpage"
            element={<ProtectedRoute user={user}><StudentPage /></ProtectedRoute>}
          />
          <Route
            path="/touristpage"
            element={<ProtectedRoute user={user}><TouristPage /></ProtectedRoute>}
          />
          <Route
            path="/travelpage"
            element={<ProtectedRoute user={user}><TravelPage /></ProtectedRoute>}
          />
          <Route
            path="/visapage"
            element={<ProtectedRoute user={user}><VisaPage /></ProtectedRoute>}
          />
          <Route
            path="/weeklynewspage"
            element={<ProtectedRoute user={user}><WeeklynewsPage /></ProtectedRoute>}
          />
          <Route
            path="/viewall"
            element={<ProtectedRoute user={user}><ViewAll /></ProtectedRoute>}
          />

         <Route
            path="/joingroups"
            element={<ProtectedRoute user={user}><GroupPage /></ProtectedRoute>}
          />

          <Route
            path="/joingroups/:groupId"
            element={<ProtectedRoute user={user}><GroupDetailPage /></ProtectedRoute>}
          />


          {/* Redirect non-matching routes */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  );
};

// Entry point rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap your application with GoogleOAuthProvider
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <DarkModeProvider>
      <UserProvider>
        {/* Wrap the entire application with Router */}
        <Router>
          <React.StrictMode>
            <MainApp />
          </React.StrictMode>
        </Router>
      </UserProvider>
    </DarkModeProvider>
  </GoogleOAuthProvider>
);
