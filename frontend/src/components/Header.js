import React, { useState } from "react";
import { UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom"; 

const Header = ({ onSearch }) => {
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search input
  const navigate = useNavigate(); 

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Trigger search when button is clicked
  const handleSearchClick = () => {
    onSearch(searchQuery); // Call the onSearch prop only on button click
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="flex items-center justify-between h-16 bg-white shadow-md border-b border-gray-200">
        <div className="flex items-center px-4 space-x-4">
          <img
            src="https://knowmyslots.com/wp-content/uploads/2024/01/logo.png"
            alt="Logo"
            className="w-16 h-auto rounded-md shadow-sm"
          />
          <h1 className="text-3xl font-bold text-gray-800">KnowMySlots</h1>
        </div>

        <div className="flex items-center space-x-2 pr-4 relative">
          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          {/* User Icon */}
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 transition duration-200 hover:bg-gray-700 ml-4"
          >
            <span className="sr-only">Open user menu</span>
            {user ? (
              <img
                src={user.profilePicture || user.image || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" }
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <UserCircleIcon className="w-10 h-10 text-white" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-[14em] w-56 bg-white rounded-xl shadow-lg z-50 transition-all duration-200 ease-in-out transform scale-95">
              <div className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <div className="font-semibold text-base truncate">{user.username}</div>
                <div className="text-gray-500 text-xs truncate">{user.email}</div>
              </div>
              <ul className="py-2 text-sm text-gray-800">
                <li>
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-100 text-gray-700 transition duration-200 rounded-lg font-medium"
                  >
                    View Profile
                  </button>
                </li>
              </ul>
              <div className="py-2 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-red-100 transition duration-200 rounded-lg font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
