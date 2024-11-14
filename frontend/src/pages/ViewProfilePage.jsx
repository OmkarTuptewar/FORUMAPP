import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Assuming you have a UserContext for user data
import { useNavigate } from "react-router-dom"; // For navigation
import { toast, ToastContainer } from "react-toastify";
import axios from "axios"; // Import axios for API requests
import { useDarkMode } from '../context/DarkModeContext'; 
const ViewProfilePage = () => {
  const { isDarkMode } = useDarkMode(); // Get dark mode status
  const { user, updateUser } = useUser(); // Get user and updateUser from context
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    about: "",
    profilePicture: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Retrieve the token from local storage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Authentication token missing. Please log in again.", {
        position: "bottom-left",
        autoClose: 5000,
      });
      navigate("/"); // Redirect to login
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token to headers
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data); // Set profile data from API
        } else {
          toast.error("Failed to fetch user data. Please try again.", {
          
            autoClose: 5000,
          });
          navigate("/"); // Redirect to login on error
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred while fetching user data.", {
         
          autoClose: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // New method to handle image upload
  const handleImageUpload = async (e) => {
    const pics = e.target.files[0]; // Get the selected file
    setIsLoading(true); // Start loading
    if (pics && (pics.type === "image/jpeg" || pics.type === "image/png")) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "GEN_Z_CONNECT");
      data.append("cloud_name", "dbeirlo9t");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dbeirlo9t/image/upload",
          data
        );

        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: response.data.url.toString(), // Set image URL in profileData
        }));
      
        toast.success("Image uploaded successfully!", {
          
          autoClose: 5000,
        });
      } catch (err) {
        console.error(err);
        toast.error("Image upload failed. Please try again.", {
        
          autoClose: 5000,
        });
      } finally {
        setIsLoading(false); // End loading
      }
    } else {
      setIsLoading(false);
      toast.warning("Please select a valid image (JPEG or PNG).", {
  
        autoClose: 5000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Bearer token to headers
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser); // Update user in context
       
        toast.success("Profile updated successfully!", {
        
          autoClose: 5000,
        });
      } else {
        toast.error("Failed to update profile. Please try again.", {
     
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.", {

        autoClose: 5000,
      });
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>; // Loading state
  }

  return (
<div className={`flex flex-col items-center justify-center min-h-screen px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <ToastContainer /> {/* Toast container for notifications */}

      <h1 className={`text-2xl font-semibold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Profile Overview
      </h1>

      <div className={`w-full max-w-sm rounded-xl shadow-md p-6 space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={profileData.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-sm transition-transform duration-200 transform hover:scale-105"
          />
          <button
            className={`text-blue-600 text-sm font-medium hover:underline focus:outline-none ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            onClick={() => document.getElementById('profilePicture').click()}
          >
            Change Profile Picture
          </button>
          <input
            id="profilePicture"
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-3 text-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'text-gray-800'}`}
              required
            />
          </div>

          {/* Username Input */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Username</label>
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleChange}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-3 text-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'text-gray-800'}`}
              required
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Address</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className={`mt-1 block w-full border-gray-200 rounded-md shadow-sm py-2 px-3 text-sm cursor-not-allowed ${isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-50 text-gray-500'}`}
              disabled
            />
          </div>

          {/* About Input */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>About</label>
            <textarea
              name="about"
              value={profileData.about}
              onChange={handleChange}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-3 text-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'text-gray-800'}`}
              rows="2"
            />
          </div>

          {/* Update Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>



  );
};

export default ViewProfilePage;
