import React, { useState } from 'react';
import answerimage from "../assets/images/answer.png";
import Modal from './Modal'; // Adjust the path as needed
import { useDarkMode } from '../context/DarkModeContext';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';


const PostForm = ({ onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { user } = useUser(); // Assuming user context provides the user object

  const openModal = () => {
    if (!user) {
      toast.error('You must be logged in to ask a question!');
      return; // Prevent the modal from opening if user is not logged in
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handlePostSubmit = () => {
    onSubmit();
    closeModal(); // Close the modal after submission
  };

  return (
    <div
      className={`absolute top-[3rem] left-0 right-0 w-full sm:w-10/14 md:w-1/3 xl:w-1/2 mx-auto p-2 rounded-lg shadow-lg flex items-center space-x-4 transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      {/* Icon/Image on the left */}
      <div className="flex-shrink-2">
        <img className="h-16 w-16" src={answerimage} alt="Icon" />
      </div>

      {/* Text Content in the middle */}
      <div className="flex-1">
        <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Can't find an answer?</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Make use of a qualified tutor to get the answer.</p>
      </div>

      {/* Button on the right */}
      <div>
        <button
          className={`font-semibold py-1 px-4 mt-3 rounded-lg transition-colors duration-200 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-800' : 'bg-blue-800 text-white hover:bg-blue-600'}`}
          onClick={openModal}
        >
          Ask a Question
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handlePostSubmit}  // Pass the handlePostSubmit function to Modal
      />
    </div>
  );
};

export default PostForm;
