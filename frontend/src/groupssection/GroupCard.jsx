import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaExpandAlt } from 'react-icons/fa';
import { useDarkMode } from "../context/DarkModeContext";
const GroupCard = ({ group }) => {
  const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewPostsClick = () => {
    navigate(`/joingroups/${group._id}`);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Base class names
  const cardClasses = `relative w-full mx-auto rounded-lg shadow-lg px-5 pt-5 ${
    isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-800'
  }`;

  const modalClasses = `bg-white rounded-lg p-5 max-w-3xl w-full ${
    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
  }`;

  return (
    <div className="flex items-center   justify-center mt-5">
      <div
        className={cardClasses}
        style={{
          fontFamily: "'Inter', sans-serif",
          maxWidth: '500px',
          boxShadow: '0 10px 10px rgba(0, 0, 0, 0.1)',
          height: '150px', 
          isDarkMode:'bg-slate-800',// Keep the height consistent for all cards
        }}
      >
        {/* Info Icon in the Top-Right Corner */}
        <div
          onClick={openModal}
          className="absolute top-3 right-4  cursor-pointer text-indigo-500 text-sm"
        >
          <FaExpandAlt />
        </div>

        {/* Quote and Description */}
        <div className="w-full mb-5">
          <div className="text-3xl text-indigo-500 text-left leading-tight h-3">“</div>
          <p className="text-sm text-gray-600  dark:text-stone-100  text-center px-5">
            {group.description.length > 30
              ? `${group.description.slice(0, 25)}...`
              : group.description}
          </p>
          <div className="text-3xl text-indigo-500 text-right leading-tight h-3 -mt-3">”</div>
        </div>

        {/* Group Info */}
        <div className="w-full">
          <p className="text-md text-indigo-500 font-bold text-center">
            {group.name.length > 20
              ? `${group.name.slice(0, 20)}...`
              : group.name}
          </p>

          <p className="text-xs text-gray-500 text-center">
            @{group.name.length > 20
              ? `${group.name.slice(0, 20).replace(' ', '').toLowerCase()}...`
              : group.name.replace(' ', '').toLowerCase()}
          </p>
        </div>

        {/* View Posts Button */}
        <div className="w-full mt-5 text-center">
          <button
            onClick={handleViewPostsClick}
            className="inline-block py-2 px-6 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300"
          >
            View posts ▶️
          </button>
        </div>
      </div>

      {/* Modal for Full Description */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className={modalClasses}>
            <h2 className="text-xl font-bold mb-4">{group.name}</h2>
            <p className="text-md text-gray-600 mb-4">{group.description}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

GroupCard.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default GroupCard;
