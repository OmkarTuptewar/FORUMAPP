import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Assuming you have a UserContext for user data
import { useNavigate } from "react-router-dom"; // For navigation
import { toast, ToastContainer } from "react-toastify";
import axios from "axios"; // Import axios for API requests

const ViewProfilePage = () => {
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
        const response = await fetch("http://localhost:5000/api/auth/me", {
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
<div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen ">
  <ToastContainer /> {/* Toast container to display toasts */}
  <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center drop-shadow-lg">
    View Profile
  </h1>
  <img
    src={profileData.profilePicture || "/path/to/default/profile.png"} // Fallback if no image is uploaded
    alt="Profile"
    className="w-28 h-28 rounded-full border-4 border-blue-700 shadow-xl mb-4 hover:scale-110 transition-transform duration-300 ease-in-out"
  />
  <form
    onSubmit={handleSubmit}
    className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-3xl shadow-2xl w-full max-w-md space-y-1"
  >
    <div className="space-y-1">
      <label className="block text-lg font-semibold text-gray-800">Name</label>
      <input
        type="text"
        name="name"
        value={profileData.name}
        onChange={handleChange}
        className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 py-2 px-4 transition duration-200 ease-in-out hover:bg-blue-50"
        required
      />
    </div>
    <div>
      <label className="block text-lg font-semibold text-gray-800">Username</label>
      <input
        type="text"
        name="username"
        value={profileData.username}
        onChange={handleChange}
        className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 py-2 px-4 transition duration-200 ease-in-out hover:bg-blue-50"
        required
      />
    </div>
    <div>
      <label className="block text-lg font-semibold text-gray-800">Email</label>
      <input
        type="email"
        name="email"
        value={profileData.email}
        onChange={handleChange}
        className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 py-2 px-4 transition duration-200 ease-in-out bg-gray-100 cursor-not-allowed"
        disabled // Make email read-only
      />
    </div>
    <div>
      <label className="block text-lg font-semibold text-gray-800">About</label>
      <textarea
        name="about"
        value={profileData.about}
        onChange={handleChange}
        className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 py-2 px-4 transition duration-200 ease-in-out hover:bg-blue-50"
        rows="3"
      />
    </div>
    <div>
      <label className="block text-lg font-semibold text-gray-800">Profile Picture</label>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleImageUpload}
        className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 py-2 px-4 transition duration-200 ease-in-out hover:bg-blue-50"
      />
    </div>
    <div className="flex justify-end">
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
      >
        Update Profile
      </button>
    </div>
  </form>
</div>






  );
};

export default ViewProfilePage;
