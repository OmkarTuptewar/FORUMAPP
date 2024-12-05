import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiGrid,
  FiBookOpen,
  FiMapPin,
  FiClipboard,
  FiTrendingUp,
} from "react-icons/fi";
import { useDarkMode } from "../context/DarkModeContext";
import { FaPlane } from "react-icons/fa";
const Sidebar = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="flex">
      {/* Sidebar container */}
      <div
        className={`hidden md:flex flex-col w-64 shadow-2xl h-screen transition-colors duration-200 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-center h-20 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <span className="text-3xl font-extrabold tracking-wide">FORUM</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-6">
            {/* Links Section */}
            <div className="space-y-3">
              <Link
                to="/home"
                className={`flex items-center px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-200 text-gray-800"
                }`}
              >
                <FiHome className="h-6 w-6 mr-3" />
                <span className="font-medium text-lg">Home</span>
              </Link>

              <Link
                to="/viewmyposts"
                className={`flex items-center px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-200 text-gray-800"
                }`}
              >
                <FiUser className="h-6 w-6 mr-3" />
                <span className="font-medium text-lg">My Posts</span>
              </Link>

              <Link
                to="/ViewAll"
                className={`flex items-center px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-200 text-gray-800"
                }`}
              >
                <FiGrid className="h-6 w-6 mr-3" />
                <span className="font-medium text-lg">View All</span>
              </Link>
            </div>

            {/* Categories Section */}
            <div>
  <h2 className="text-2xl font-semibold mb-4 text-center border-b-2 pb-2">
    Explore Categories
  </h2>
  <div className="space-y-4">
    <Link
      to="/studentpage"
      className={`flex items-center px-6 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white"
          : "bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 text-gray-800"
      }`}
    >
      <FiBookOpen className="h-6 w-6 mr-4 bg-white rounded-full p-1 shadow-lg text-blue-500" />
      <span className="text-lg font-semibold">Student</span>
    </Link>

    <Link
      to="/touristpage"
      className={`flex items-center px-6 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white"
          : "bg-gradient-to-r from-green-200 to-green-300 hover:from-green-300 hover:to-green-400 text-gray-800"
      }`}
    >
      <FiMapPin className="h-6 w-6 mr-4 bg-white rounded-full p-1 shadow-lg text-green-500" />
      <span className="text-lg font-semibold">Tourist</span>
    </Link>

    <Link
      to="/travelpage"
      className={`flex items-center px-6 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white"
          : "bg-gradient-to-r from-purple-200 to-purple-300 hover:from-purple-300 hover:to-purple-400 text-gray-800"
      }`}
    >
      <FaPlane className="h-6 w-6 mr-4 bg-white rounded-full p-1 shadow-lg text-purple-500" />
      <span className="text-lg font-semibold">Travel</span>
    </Link>

    <Link
      to="/visapage"
      className={`flex items-center px-6 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white"
          : "bg-gradient-to-r from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-gray-800"
      }`}
    >
      <FiClipboard className="h-6 w-6 mr-4 bg-white rounded-full p-1 shadow-lg text-yellow-500" />
      <span className="text-lg font-semibold">Visa</span>
    </Link>

    <Link
      to="/weeklynewspage"
      className={`flex items-center px-6 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white"
          : "bg-gradient-to-r from-red-200 to-red-300 hover:from-red-300 hover:to-red-400 text-gray-800"
      }`}
    >
      <FiTrendingUp className="h-6 w-6 mr-4 bg-white rounded-full p-1 shadow-lg text-red-500" />
      <span className="text-lg font-semibold">Weekly News</span>
    </Link>
  </div>
</div>

          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
