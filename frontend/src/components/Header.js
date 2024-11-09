import React, { useState } from "react";
import Modal from "./Modal";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom"; 

const Header = () => {
  const { user, logout } = useUser(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); 

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col bg-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between h-16 bg-white shadow-md border-b border-gray-200">
          <div className="flex items-center px-4 space-x-4">
            <img
              src="https://knowmyslots.com/wp-content/uploads/2024/01/logo.png"
              alt="Logo"
              className="w-28 h-auto rounded-md shadow-sm"
            />
            <h1 className="text-3xl font-bold text-gray-800">KnowMySlots</h1>
          </div>

          <div className="flex items-center pr-4 relative">
            <button
              onClick={openModal}
              className="text-gray-600 hover:text-gray-800 font-semibold transition duration-200 mr-4 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Ask
            </button>

            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 transition duration-200 hover:bg-gray-700"
            >
              <span className="sr-only">Open user menu</span>
              {user ? (
                <img
                  src={user.profilePicture || user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10 text-white" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-[14em] w-48 bg-white rounded-lg shadow-lg z-50 transition duration-200">
                <div className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                  <div className="font-medium">{user.username}</div>
                  <div className="text-gray-600 truncate">{user.email}</div>
                </div>
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200 rounded-md"
                    >
                      View Profile
                    </button>
                  </li>
                </ul>
                <div className="py-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition duration-200 rounded-md"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </>
  );
};

export default Header;
