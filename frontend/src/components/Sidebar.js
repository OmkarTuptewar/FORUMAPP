import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
  FiUserPlus,
  FiMessageCircle,
  FiShare2,
} from "react-icons/fi";
import { FaPlane } from "react-icons/fa";
import { useDarkMode } from "../context/DarkModeContext";

const Sidebar = () => {
  const { isDarkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navLinkClasses = (isDark) =>
    `flex items-center px-4 py-3 rounded-lg transition-all transform hover:scale-105 ${
      isDark
        ? "hover:bg-gray-800 hover:text-gray-200"
        : "hover:bg-gray-100 hover:text-gray-800"
    }`;

  return (
    <div className="relative flex h-screen">
      {/* Sidebar Toggle Button */}
      <button
        className={`absolute top-4 left-4 z-50 md:hidden ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-60 h-full z-40 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static flex flex-col ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        } shadow-lg`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-center h-16 text-2xl font-bold tracking-wider ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } border-1 `}
        >
          FORUM
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
  <div className="space-y-2 text-sm">
    {[
      { to: "/home", icon: FiHome, label: "Home" },
      { to: "/viewmyposts", icon: FiUser, label: "My Posts" },
      { to: "/ViewAll", icon: FiGrid, label: "View All" },
      { to: "/joingroups", icon: FiUsers, label: "Explore Groups", isJoinGroups: true },  // Added isJoinGroups flag
    ].map(({ to, icon: Icon, label, isJoinGroups }) => (
      <NavLink  
        key={to}
        to={to}
        className={({ isActive }) =>
          `${navLinkClasses(isDarkMode)} ${
            isActive
              ? isDarkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-200 text-gray-900"
              : ""
          } ${isJoinGroups ? 'bg-blue-600 text-white text-sm hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all ease-in-out duration-300' : ''}`  // Solid color for Join Groups button
        }
        aria-current="page"
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{label}</span>
      </NavLink>
    ))}
  </div>




          {/* Explore Categories */}
          <div>
            <h2 className="text-sm font-semibold mb-4 text-center border-b-2 pb-2">
              Explore Categories
            </h2>
            <div className="space-y-3 text-sm">
              {[
                {
                  to: "/studentpage",
                  icon: FiBookOpen,
                  label: "Student",
                  color: "text-blue-500",
                },
                {
                  to: "/touristpage",
                  icon: FiMapPin,
                  label: "Tourist",
                  color: "text-green-500",
                },
                {
                  to: "/travelpage",
                  icon: FaPlane,
                  label: "Travel",
                  color: "text-purple-500",
                },
                {
                  to: "/visapage",
                  icon: FiClipboard,
                  label: "Visa",
                  color: "text-yellow-500",
                },
                {
                  to: "/weeklynewspage",
                  icon: FiTrendingUp,
                  label: "Weekly News",
                  color: "text-red-500",
                },
              ].map(({ to, icon: Icon, label, color }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={`flex items-center px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gray-100 text-gray-900"
                  }`}
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
    </div>
  );
};

export default Sidebar;
