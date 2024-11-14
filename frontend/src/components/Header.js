import React, { useState } from "react";
import { UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

import { PowerIcon } from '@heroicons/react/24/outline';  // or 24/solid

import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";

const Header = ({ onSearch }) => {
  const { user, logout } = useUser();
  const [isSearchVisible, setIsSearchVisible] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchClick = () => {
    onSearch(searchQuery);
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div
      className={`transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <div className="flex flex-col shadow-md">
        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center space-x-4">
            <img
              src="https://knowmyslots.com/wp-content/uploads/2024/01/logo.png"
              alt="Logo"
              className="w-12 h-auto rounded-md shadow-sm md:w-16"
            />
            <h1 className={`text-2xl font-bold md:text-3xl ${isSearchVisible ? 'hidden' : 'block'} sm:block` }>KnowMySlots</h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Input (Visible when clicked on small devices) */}
            <div className={`transition-all duration-200 ${isSearchVisible ? 'block' : 'hidden'} sm:block`}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className={`px-3 py-1 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              />
            </div>

            {/* Search Icon (Always visible on all devices) */}
            <button
              onClick={handleSearchClick}
              className={`p-2 rounded-lg flex items-center ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } transition-colors duration-200`}
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={toggleDropdown}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'
              } transition duration-200 ml-4`}
            >
              {user ? (
                <img
                  src={user.profilePicture || user.image || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10 text-white" />
              )}
            </button>

            {isDropdownOpen && (
  <div
    className={`absolute right-0 mt-[38vh] w-56 rounded-xl shadow-lg ${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    } transition-all duration-200 ease-in-out transform scale-95 z-50`}
  >
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="font-semibold text-base truncate">{user.username}</div>
      <div className="text-xs truncate">{user.email}</div>
    </div>
    <ul className="py-2">
      <li>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-600 rounded-lg transition duration-200"
        >
          <UserIcon className="w-5 h-5 mr-3" />
          <span>View Profile</span>
        </button>
      </li>
      <li>
        <button
          onClick={toggleDarkMode}
          className="flex items-center w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-600 rounded-lg transition duration-200"
        >
          {isDarkMode ? (
            <SunIcon className="w-5 h-5 mr-3" />
          ) : (
            <MoonIcon className="w-5 h-5 mr-3" />
          )}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </li>
    </ul>
    <div className="py-2 border-t border-gray-200">
      <button
        onClick={handleLogout}
        className="flex items-center w-full text-left text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-600 dark:text-red-300 transition duration-200 px-4 py-2 rounded-lg"
      >
        <PowerIcon className="w-5 h-5 mr-3" />
        <span>Sign Out</span>
      </button>
    </div>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
