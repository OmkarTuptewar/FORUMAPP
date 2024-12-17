import React, { useState } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

const Modal = ({ closeModal, setPosts }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePostSubmit = async () => {
    if (!title || !description) {
      setError('Title and Description are required!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        {
          title,
          description,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new post to the list
      setPosts(prevPosts => [response.data, ...prevPosts]);
      closeModal(); // Close the modal after successful post creation
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full sm:w-96 shadow-lg">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Create a New Post</h2>
        
        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows="4"
        ></textarea>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="Student">Student</option>
          <option value="Tourist">Tourist</option>
          <option value="Travel">Travel</option>
          <option value="Visa">Visa</option>
          <option value="Weekly News">Weekly News</option>
        </select>

        <button
          onClick={handlePostSubmit}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating Post...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default Modal;
