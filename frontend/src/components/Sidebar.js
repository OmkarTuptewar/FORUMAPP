import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiGrid,
  FiBookOpen,
  FiMapPin,
  FiClipboard,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiUsers,
} from "react-icons/fi";
import { FaPlane } from "react-icons/fa";
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/UserContext"; // Importing UserContext
import { toast } from "react-toastify"; // Assuming you're using react-toastify for toast notifications

import Login2 from "../pages/auth/LoginPage2";
import SignupModal from "../pages/auth/SignupModal";

const Sidebar = () => {
  const { isDarkMode } = useDarkMode();
  const { user } = useUser(); // Get user data from context
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Modal state for login
  const [isSignupOpen, setSignupOpen] = useState(false);
  const navigate = useNavigate();

  const openSignup = () => {
    setIsLoginModalOpen(false);
    setSignupOpen(true);
  };
  
  const openLogin = () => {
    setIsLoginModalOpen(true);
    setSignupOpen(false);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setSignupOpen(false);
  }; 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navLinkClasses = (isDark) =>
    `flex items-center px-4 py-3 rounded-lg transition-all transform hover:scale-105 ${
      isDark
        ? "hover:bg-gray-800 hover:text-gray-200"
        : "hover:bg-gray-100 hover:text-gray-800"
    }`;

    const handleLinkClick = (to, event) => {
      // Allow access to /home without authentication
      if (to === "/home") {
        navigate(to); // Navigate directly to the Home page
        return;
      }
    
      // Check if user exists (is logged in) for other routes
      if (!user) {
        event.preventDefault(); // Prevent navigation
        toast.warn("Please log in to access this page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsLoginModalOpen(true); // Open login modal
        return; // Don't navigate if user is not logged in
      }
    
      // Navigate if user is logged in
      navigate(to);
    };
    

  return (
    <div className="relative flex h-screen ">
      {/* Sidebar Toggle Button */}
      <button
        className={`absolute top-4 left-4 z-50 md:hidden ${isDarkMode ? "text-white" : "text-gray-800"}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-60 h-full z-40 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static flex flex-col ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} shadow-lg`}
      >
        {/* Header */}
        <div className={`flex items-center justify-center h-16 text-2xl font-bold tracking-wider ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} border-1 `}>
          FORUM
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto ">
          <div className="space-y-2 text-sm">
            {[{ to: "/home", icon: FiHome, label: "Home" },
              { to: "/viewmyposts", icon: FiUser, label: "My Posts" },
              { to: "/ViewAll", icon: FiGrid, label: "View All" },
              { to: "/joingroups", icon: FiUsers, label: "Explore Groups", isJoinGroups: true }].map(
              ({ to, icon: Icon, label, isJoinGroups }) => (
                <div key={to}>
                  <NavLink
                    to={to}
                    onClick={(event) => handleLinkClick(to, event)} // Link click handler
                    className={({ isActive }) =>
                      `${navLinkClasses(isDarkMode)} ${isActive ? (isDarkMode ? "bg-gray-800 text-gray-200" : "bg-blue-800 text-gray-100") : ""} ${isJoinGroups ? 'bg-blue-600 text-white text-sm hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all ease-in-out duration-300' : ''}`
                    }
                    aria-current="page"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{label}</span>
                  </NavLink>
                </div>
              )
            )}
          </div>

          {/* Explore Categories */}
          <div>
  <h2 className="text-sm font-semibold mb-4 text-center border-b-2 pb-2">
    Explore Categories
  </h2>
  <div className="space-y-3 text-sm">
    {[
      { to: "/studentpage", icon: FiBookOpen, label: "Student", color: "text-blue-500" },
      { to: "/touristpage", icon: FiMapPin, label: "Tourist", color: "text-green-500" },
      { to: "/travelpage", icon: FaPlane, label: "Travel", color: "text-indigo-500" },
      { to: "/visapage", icon: FiClipboard, label: "Visa", color: "text-yellow-500" },
      { to: "/weeklynewspage", icon: FiTrendingUp, label: "Weekly News", color: "text-red-500" },
    ].map(({ to, icon: Icon, label, color }) => (
      <NavLink
        key={to}
        to={to}
        onClick={(event) => handleLinkClick(to, event)} // Link click handler
        className={({ isActive }) =>
          `flex items-center px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
            isActive
              ? "bg-blue-800 text-white font-bold"
              : "bg-gray-100 text-gray-900"
          }`
        }
        aria-current="page"
      >
        <Icon className={`w-6 h-6 mr-3 ${color}`} />
        <span>{label}</span>
      </NavLink>
    ))}
  </div>
</div>

        </nav>
      </div>

      {/* Render Login Modal if isLoginModalOpen is true */}
      {isLoginModalOpen && (
        <Login2
        onClose={closeModals} onSwitchToSignup={openSignup} // Close modal when the user logs in
        />
      )}

       {isSignupOpen && <SignupModal
       onSwitchToLogin={openLogin}  onClose={closeModals} />}
    </div>
  );
};

export default Sidebar;
