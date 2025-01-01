import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import bgimage from '../../assets/images/forumimage.jpg'
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin component
import { useDarkMode } from "../../context/DarkModeContext";

const Login = () => {
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
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-neutral-100 hidden lg:flex w-full md:w-1/2 xl:w-2/3 h-screen items-center justify-center flex-col relative">
        {/* Top-left logo and title */}
        <div className="absolute top-4 left-4 flex items-center px-4 space-x-4">
          <img
            src="https://knowmyslots.com/wp-content/uploads/2024/01/logo.png"
            alt="Logo"
            className="w-16 h-auto rounded-md shadow-2xl"
          />
          <h1 className="text-3xl font-bold text-gray-800">KnowMySlots</h1>
        </div>

        {/* Centered content */}
        <img
          src={bgimage}
          alt="Background representing KnowMySlots community"
          className="h-[45vh] w-auto object-cover border-black border-y-2 rounded-md shadow-sm"
        />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug text-center mt-4 text-gray-800">
          <span className="block">Welcome to KnowMySlots</span>
          <span className="text-lg md:text-xl lg:text-2xl font-semibold mt-2 block text-gray-700">
            Join our community to unlock unparalleled expertise and dedicated support!
          </span>
        </h1>
      </div>

      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <form className="mt-6" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-semibold font-mono text-gray-800 pb-8">Login to your account</h1>

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
          
          <p className="mt-8 text-center  text-black">
            Need an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>

     
    </section>
  );
};

export default Login;
