import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import { ToastContainer, toast } from 'react-toastify'; // Import React Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { useDarkMode } from '../context/DarkModeContext';
const Modal = ({ isOpen, onClose,onSubmit}) => {
  const { isDarkMode } = useDarkMode(); // Get dark mode status

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pic, setPic] = useState(null); // Use 'pic' to store image URL
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Manage loading state



    const handleImageUpload = async (pics) => {
      setLoading(true); // Start loading
      if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
        data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    
        try {
          const response = await axios.post(
            process.env.REACT_APP_CLOUDINARY_API_URL,
            data
          );
          setPic(response.data.url.toString()); // Store image URL
          setLoading(false); // End loading
          toast.success('Image uploaded successfully!', {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } catch (err) {
          console.error(err);
          setLoading(false);
          toast.error('Image upload failed. Please try again.', {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        setLoading(false);
        toast.warning('Please select a valid image (JPEG or PNG).', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };



    
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (loading) {
      toast.info('Please wait for the image to finish uploading.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      return; // Prevent submission if image is still uploading
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('No authentication token found. Please log in again.');
      toast.error('Authentication token missing. Please log in again.', {
        position: 'bottom-right',
        autoClose: 5000,
      });
      return;
    }

    // Prepare post data
    const postData = {
      title,
      content: description,
      category,
      image: pic, // Image URL from Cloudinary
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Send as JSON
        },
        body: JSON.stringify(postData), // Convert to JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
     

      const result = await response.json();
      
             
      toast.success('Post created successfully!', {
        position: 'bottom-right',
        autoClose: 5000,
      });
      setTimeout(() => {
        onSubmit(); 
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving post:', error);
      setErrorMessage(error.message || 'Failed to create post');
      toast.error(error.message || 'Failed to create post', {
        position: 'bottom-right',
        autoClose: 5000,
      });
    }
    
  };

  // Reset state when the modal closes
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPic(null);
    setCategory('');
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
    <ToastContainer /> {/* Toast container to display toasts */}
  
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 max-w-lg mx-4">
    <h2 className="text-xl mb-4 text-gray-800 dark:text-white">Post a Question</h2>

    {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}

    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input
          type="text"
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select a category</option>
          <option value="Student">Student</option>
          <option value="Tourist">Tourist</option>
          <option value="Travel">Travel</option>
          <option value="Visa">Visa</option>
          <option value="Weekly-News">Weekly-News</option>
          
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image (optional)</label>
        <input
          type="file"
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          disabled={loading} // Disable input if uploading
        />
        {loading && <p className="text-blue-500">Uploading image...</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClose}
          className="mr-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading} // Disable submit while image is uploading
        >
          {loading ? 'Uploading...' : 'Post'}
        </button>
      </div>
    </form>
  </div>
</div>

  </>
  
  );
};

export default Modal;
