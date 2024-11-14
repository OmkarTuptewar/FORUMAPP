import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAllPosts = ({ newPost, searchQuery = '' }) => { // Set a default value for searchQuery
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
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
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, [newPost]);

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    (post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (post.content?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

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
      <PostList posts={filteredPosts} setPosts={setPosts} />
    </div>
  );
};

export default ViewAllPosts;
