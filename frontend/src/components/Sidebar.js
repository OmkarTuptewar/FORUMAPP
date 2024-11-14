import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiGrid, FiActivity } from 'react-icons/fi';
import { useDarkMode } from '../context/DarkModeContext';

const Sidebar = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="flex ">
      {/* Sidebar container */}
      <div className={`hidden md:flex flex-col w-64 shadow-2xl transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-center h-16 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}> 
          <span className="text-3xl font-bold">FORUM</span>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-4">
            {/* Home Link */}
            <Link to="/home" className={`flex items-center px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}>
              <FiHome className="h-5 w-5 mr-3" />
              <span>Home</span>
            </Link>

            {/* View My Posts Link */}
            <Link to="/viewmyposts" className={`flex items-center px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}>
              <FiUser className="h-5 w-5 mr-3" />
              <span>View My Posts</span>
            </Link>

            {/* View All Link */}
            <Link to="/viewall" className={`flex items-center px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}>
              <FiGrid className="h-5 w-5 mr-3" />
              <span>View All</span>
            </Link>
            
            {/* Activities Link */}
            <Link to="/activities" className={`flex items-center px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}>
              <FiActivity className="h-5 w-5 mr-3" />
              <span>Activities</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
