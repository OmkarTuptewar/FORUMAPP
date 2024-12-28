import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select"; // Ensure react-select is installed
import { useDarkMode } from "../context/DarkModeContext";

const GroupPostModal = ({ isOpen, onClose, onSubmit, groupId }) => {
  const { isDarkMode } = useDarkMode();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pic, setPic] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]); // State for tags

  const tagsOptions = [
    { value: "education", label: "Education" },
    { value: "technology", label: "Technology" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health" },
    { value: "other", label: "Other" },
  ];
  const handleImageUpload = async (pics) => {
    setLoading(true); // Start loading
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
        toast.success("Image uploaded successfully!", {
          position: "bottom-right",
          autoClose: 5000,
        });
      } catch (err) {
        console.error(err);
        setLoading(false);
        toast.error("Image upload failed. Please try again.", {
          position: "bottom-right",
          autoClose: 5000,
        });
      }
    } else {
      setLoading(false);
      toast.warning("Please select a valid image (JPEG or PNG).", {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag.", {
        position: "bottom-right",
        autoClose: 5000,
      });
      return;
    }

    if (loading) {
      toast.info("Please wait for the image to finish uploading.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No authentication token found. Please log in again.");
      toast.error("Authentication token missing. Please log in again.", {
        position: "bottom-right",
        autoClose: 5000,
      });
      return;
    }

    const postData = {
      title,
      content: description,
      image: pic,
      groupId,
      tags: selectedTags.map((tag) => tag.value), // Send only tag values
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/group/creategrouppost`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Post created successfully!", {
        position: "bottom-right",
        autoClose: 5000,
      });
      setTimeout(() => {
        onSubmit();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error saving post:", error);
      setErrorMessage(error.message || "Failed to create post");
      toast.error(error.message || "Failed to create post", {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPic(null);
    setSelectedTags([]);
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
 
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        } w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 max-w-lg p-6 rounded-lg shadow-lg`}
      >
        <h2 className="text-lg font-semibold mb-4">Post to Group</h2>
        {errorMessage && (
          <div className="mb-4 text-red-600 dark:text-red-400">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className={`block text-sm py-1 font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Title
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm py-1 font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Description
            </label>
            <textarea
              className={`w-full p-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm py-1 font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Tags
            </label>
            <Select
              isMulti
              options={tagsOptions}
              value={selectedTags}
              onChange={setSelectedTags}
              placeholder="Select tags"
              className="dark:text-black"
            />
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm py-1 font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Image (optional)
            </label>
            <input
              type="file"
              className={`w-full p-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
              onChange={(e) => handleImageUpload(e.target.files[0])}
              disabled={loading}
            />
            {loading && (
              <p className="text-blue-500 dark:text-blue-300">Uploading image...</p>
            )}
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium rounded bg-blue-500 text-white hover:bg-blue-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
  );
};

export default GroupPostModal;