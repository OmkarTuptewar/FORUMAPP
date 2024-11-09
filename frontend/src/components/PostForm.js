// PostForm.js
import React, { useState } from 'react';
import answerimage from "../assets/images/answer.png";
import Modal from './Modal'; // Adjust the path as needed

const PostForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  return (
    <div className="absolute top-[3.5rem]  h-24 left-0 right-0 bottom-0 w-6/12 mx-auto bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
      {/* Icon/ Image on the left */}
      <div className="flex-shrink-0">
        <img 
          className="h-16 w-16" 
          src={answerimage}
          alt="Icon"
        />
      </div>

      {/* Text Content in the middle */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">Can't find an answer?</h2>
        <p className="text-gray-500">Make use of a qualified tutor to get the answer.</p>
      </div>

      {/* Button on the right */}
      <div>
        <button
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={openModal}
        >
          Ask a Question
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default PostForm;
