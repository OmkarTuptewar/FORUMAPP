// src/components/EditPostModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditPostModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [category, setCategory] = useState(initialData.category);
  const [image, setImage] = useState(initialData.image);
  const [isLoading, setIsLoading] = useState(false); // Loading state for image upload

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCategory(initialData.category);
      setImage(initialData.image);
    }
  }, [initialData]);

  // Handle the image upload
  const handleImageUpload = async (e) => {
    const pics = e.target.files[0];
    setIsLoading(true);
    if (pics && (pics.type === 'image/jpeg' || pics.type === 'image/png')) {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'GEN_Z_CONNECT');
      data.append('cloud_name', 'dbeirlo9t');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dbeirlo9t/image/upload',
          data
        );
        setImage(response.data.url.toString()); // Set image URL in state
        toast.success('Image uploaded successfully!', { autoClose: 5000 });
      } catch (err) {
        console.error(err);
        toast.error('Image upload failed. Please try again.', { autoClose: 5000 });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      toast.warning('Please select a valid image (JPEG or PNG).', { autoClose: 5000 });
    }
  };

  const handleSave = () => {
    const editedData = { _id: initialData._id, title, content, category, image };
    onSave(editedData);  // Pass the updated post data to the parent
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>
        <div className="flex">
          <div className="flex-shrink-0 w-1/3 mr-4">
            <label className="block text-gray-700 font-bold mb-2">Image</label>
            <input type="file" onChange={handleImageUpload} className="w-full mb-4" />
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              image && (
                <img src={image} alt="Selected" className="w-full h-60 object-cover rounded-lg" />
              )
            )}
          </div>

          <div className="w-2/3">
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter post title"
            />

            <label className="block text-gray-700 font-bold mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
              rows="4"
              placeholder="Enter post content"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="View All">View All</option>
                <option value="Activities">Activities</option>
                <option value="General">General</option>
                <option value="Ideas">Ideas</option>
                <option value="User Feedback">User Feedback</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
