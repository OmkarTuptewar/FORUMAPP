import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      setLoading(false); // Clear loading state
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure formData contains { email, password }
      });

      setLoading(false); // Clear loading state

      if (response.ok) {
        const userData = await response.json();
         console.log(userData);
        // Store user data and token in localStorage
        localStorage.setItem('userInfo', JSON.stringify(userData));
        localStorage.setItem('token', userData.token); // Store token if returned

        // Update the context with the logged-in user data
        setUser(userData);

        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/home'); // Redirect to homepage or another page
        }, 1000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoading(false); // Clear loading state on error
      toast.error('Login failed, please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">KnowMyslots</h1>
          <p className="text-gray-500 mt-2">Welcome back! Please log in to your account.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-lg font-semibold"
            >
              Login
            </button>
          </div>

          <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/Signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Signup
            </a>
          </p>
        </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
