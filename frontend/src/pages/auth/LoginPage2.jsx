import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import bgimage from '../../assets/images/forumimage.jpg'
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin component
import { useDarkMode } from "../../context/DarkModeContext";

const Login2 = ({ onClose ,onSwitchToSignup }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setLoading(false);

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("userInfoknowmyslotsforum", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);

        setUser(userData);
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
        onClose(); // Close the modal on successful login
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoading(false);
      toast.error("Login failed, please try again.");
    }
  };

  // Google login success handler
  const handleGoogleLogin = async (response) => {
    try {
      const { credential } = response;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credential }),
      });

      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem("userInfo", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);

        setUser(userData);
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
        onClose(); // Close the modal on successful Google login
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Google login failed");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error("Google login failed, please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close modal when backdrop is clicked
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96"
        onClick={(e) => e.stopPropagation()} // Prevent modal content from closing when clicked
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Login Form */}
        <h1 className="text-2xl font-semibold font-mono text-gray-800 pb-8">Login to your account</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-black mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border  text-black focus:border-blue-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div className="text-right mt-2">
            <a
              href="#"
              className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <hr className="my-6 border-gray-300 w-full" />

        <GoogleLogin
          onSuccess={handleGoogleLogin} // Success callback for Google login
          onError={() => toast.error("Google login failed")}
          useOneTap
          theme="outline"
        />

<p className="mt-8 text-center text-black">
          Need an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login2;
