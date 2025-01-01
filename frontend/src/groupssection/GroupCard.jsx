import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaExpandAlt, FaLock } from 'react-icons/fa'; // Import FaLock for the lock icon
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/UserContext"; // Import useUser context for the user's email
import { toast } from 'react-toastify'; // To show toast notifications
import { IoIosLock } from "react-icons/io";

const GroupCard = ({ group, bgColor }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user } = useUser(); // Get the user context to access email
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewPostsClick = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
  
    // If the group is public, navigate directly
    if (group.visibility === "public") {
      navigate(`/joingroups/${group._id}`);
    } else {
      // For private groups, just allow access regardless of email
      try {
        // Navigate directly without checking the email domain
        navigate(`/joingroups/${group._id}`);
      } catch (error) {
        console.error('Error accessing the group:', error);
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };




  // Base class names
  const cardClasses = `relative w-full mx-auto rounded-lg shadow-lg px-5 pt-5 ${
    bgColor 
  } text-gray-800`;




  const modalClasses = `bg-white rounded-lg p-5 max-w-3xl w-full ${
    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
  }`;

  return (
    <div className="flex items-center justify-center mt-5">
    <div
      className={`${cardClasses}  dark:text-stone-200`}
      style={{
        fontFamily: "'Inter', sans-serif",
        maxWidth: '500px',
        boxShadow: '0 10px 10px rgba(0, 0, 0, 0.1)',
        height: '150px', // Keep the height consistent for all cards
      }}
    >
      {/* Info Icon in the Top-Right Corner */}
      <div
        onClick={openModal}
        className="absolute top-3 right-4 cursor-pointer text-indigo-500 text-sm dark:text-indigo-400"
      >
        <FaExpandAlt />
      </div>
  
      {/* Lock Icon for Private Groups */}
      {group.visibility === 'private' && (
        <div className="absolute bottom-3 right-4 cursor-pointer text-indigo-800 dark:text-indigo-500 text-2xl">
          <IoIosLock />
        </div>
      )}
  
      {/* Quote and Description */}
      <div className="w-full mb-5">
        <div className="text-3xl text-indigo-500 dark:text-indigo-400 text-left leading-tight h-3">“</div>
        <p className="text-sm text-gray-600 dark:text-stone-400 text-center px-5">
          {group.description.length > 30
            ? `${group.description.slice(0, 25)}...`
            : group.description}
        </p>
        <div className="text-3xl text-indigo-500 dark:text-indigo-400 text-right leading-tight h-3 -mt-3">”</div>
      </div>
  
      {/* Group Info */}
      <div className="w-full">
        <p className="text-md text-black dark:text-stone-200 font-bold text-center">
          {group.name.length > 20
            ? `${group.name.slice(0, 20)}...`
            : group.name}
        </p>
  
        {/* <p className="text-xs text-gray-500 dark:text-stone-400 text-center">
          @{group.name.length > 20
            ? `${group.name.slice(0, 20).replace(' ', '').toLowerCase()}...`
            : group.name.replace(' ', '').toLowerCase()}
        </p> */}
      </div>
  
      {/* View Posts Button */}
      <div className="w-full mt-8 text-center">
        <button
          onClick={handleViewPostsClick}
          className="inline-block py-2 px-6 rounded-lg text-sm font-medium bg-blue-700 dark:bg-blue-800 text-white hover:bg-blue-400 dark:hover:bg-blue-600 transition-all duration-300"
        >
          View posts ▶️
        </button>
      </div>
    </div>
  
    {/* Modal for Full Description */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80 flex justify-center items-center z-50">
        <div className={`${modalClasses} dark:bg-gray-800 dark:text-stone-100`}>
          <div className="flex justify-between items-center mb-4">
            {/* Group Visibility */}
            <span
              className={`text-sm font-semibold ${
                group.visibility === 'private'
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-green-500 dark:text-green-400'
              }`}
            >
              {group.visibility === 'private' ? 'Private Group' : 'Public Group'}
            </span>
  
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="py-2 px-4 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-400 dark:hover:bg-red-500 transition-all duration-300"
            >
              Close
            </button>
          </div>
  
          <h2 className="text-xl font-bold mb-4">{group.name}</h2>
          <p className="text-md text-gray-600 dark:text-stone-200 mb-4">{group.description}</p>
  
          {/* Display Allowed Email Domain */}
          {group.visibility === 'private' && group.accessCriteria?.emailDomain && (
            <div className="text-md text-gray-700 dark:text-stone-300 mt-4">
              <h3 className="text-lg font-semibold mb-3">Allowed Email Domains</h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
                  <tbody>
                    {chunkArray(group.accessCriteria?.emailDomain.split(','), 4).map((chunk, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        {chunk.map((domain, i) => (
                          <td key={i} className="px-4 py-2 text-gray-900 dark:text-stone-200">
                            <span className="text-blue-500 dark:text-blue-400 font-semibold">
                              {domain.trim()}
                            </span>
                          </td>
                        ))}
                        {chunk.length < 4 &&
                          Array(4 - chunk.length)
                            .fill('')
                            .map((_, i) => (
                              <td key={`empty-${i}`} className="px-4 py-2"></td>
                            ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
    visibility: PropTypes.string.isRequired,
    accessCriteria: PropTypes.shape({
      emailDomain: PropTypes.string.isRequired,
    }),
  }).isRequired,
  bgColor: PropTypes.string.isRequired, // Add bgColor as required prop
};


export default GroupCard;
