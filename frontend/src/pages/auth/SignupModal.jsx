import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/UserContext";

  const SignupModal = ({ onClose, onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setLoading(false);

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);

        setUser(userData);
        toast.success("Signup successful! Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setLoading(false);
      toast.error("Signup failed, please try again.");
    }
  };

  return (
    <div
  className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
  onClick={onClose}
>
  <div
    className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Close button */}
    <button
      className="absolute top-3 right-3 text-gray-600"
      onClick={onClose}
    >
      &times;
    </button>

    {/* Signup Form */}
    <h1 className="text-2xl font-semibold font-mono text-gray-800 pb-6">
      Create Your Account
    </h1>

    <form onSubmit={handleSubmit}>
      <div>
        <label className="block text-base text-gray-700">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-md bg-gray-200 text-black mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-base text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Choose a Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-md bg-gray-200 text-black mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-base text-gray-700">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-md bg-gray-200 text-black mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-base text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Create a Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-md bg-gray-200 text-black mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-base text-gray-700">Confirm Password</label>
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-md bg-gray-200 text-black mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-md px-4 py-3 mt-6 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>

    <p className="mt-6 text-center text-gray-800 text-sm">
      Already have an account?{" "}
      <button
        onClick={onSwitchToLogin}
        className="text-blue-500 hover:text-blue-700 font-medium"
      >
        Log In
      </button>
    </p>
  </div>
</div>

  
  );
};

export default SignupModal;
