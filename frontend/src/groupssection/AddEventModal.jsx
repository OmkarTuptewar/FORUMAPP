import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed for toasts

const AddEventModal = ({ onClose, onSave }) => {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const pics = e.target.files[0];
    setIsLoading(true);
    if (pics && (pics.type === 'image/jpeg' || pics.type === 'image/png')) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

      try {
        const response = await axios.post(
          process.env.REACT_APP_CLOUDINARY_API_URL,
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
    if (date && name) {
      onSave({ date, name, description, imageUrl: image });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-4 w-80">
        <h2 className="text-lg font-bold mb-3 text-gray-900">Add New Event</h2>

        {/* Date Field */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 px-2 py-1 text-black border rounded-md"
          />
        </div>

        {/* Event Name Field */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 px-2 py-1 text-black border rounded-md"
          />
        </div>

        {/* Description Field */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 px-2 text-black py-1 border rounded-md"
            rows="3"
          />
        </div>

        {/* Image Upload Field */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Event Image (optional)</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full mt-1"
          />
          {isLoading && <p className="text-sm text-gray-500">Uploading image...</p>}
          {image && (
            <div className="mt-2">
              <img src={image} alt="Event" className="w-full h-32 object-cover rounded-md" />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-pink-500 rounded-md text-white hover:bg-pink-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
