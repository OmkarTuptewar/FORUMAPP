import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VisaPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisaPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter posts where the category is "Visa"
        const visaPosts = response.data.filter(post => post.category === 'Visa');
        setPosts(visaPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching visa posts:', err);
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchVisaPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-screen">
      <ToastContainer />
      <PostList posts={posts} setPosts={setPosts} />
    </div>
  );
};

export default VisaPage;