import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useUser } from '../../context/UserContext'; 
import bgimage from '../../assets/images/forumimage.jpg'
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const { setUser } = useUser(); 
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match'); 
      return;
    }

    // Add your signup logic here
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();

      
        localStorage.setItem('userInfomyslotsforum', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
       
        setUser(userData);

        toast.success('Signup successful! Redirecting...');
        setTimeout(() => {
        
          navigate('/Home');
        }, 1000); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('Signup failed, please try again.'); 
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
          <h1 className="text-3xl font-bold text-gray-800 bg-">KnowMySlots</h1>
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


    
<div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-8 xl:px-12 flex items-center justify-center">
  <div className="w-full h-auto">
    <form className="mt-1" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-semibold font-mono text-gray-800 p-3">Sign Up to Create an Account</h1>

      <div>
        <label className="block text-gray-700 text-sm">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 text-sm border  text-black focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 text-sm">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Choose a Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 text-sm border  text-black focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 text-sm">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 text-sm border  text-black focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 text-sm">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Create a Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 text-sm border  text-black focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 text-sm">Confirm Password</label>
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm your Password"
          value={formData.confirm_password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 text-sm border  text-black focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
      >
        Sign Up
      </button>
    </form>

    <hr className="my-6 border-gray-300 w-full" />

   

    <p className="text-center  text-black">
      Already have an account?{" "}
      <a
        href="/"
        className="text-blue-500 hover:text-blue-700 font-semibold"
      >
        Log in
      </a>
    </p>
  </div>
</div>


    
    
    </section>
    
  
  );
};

export default Signup;
