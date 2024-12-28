import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';

import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loadermodal';
import Header from '../components/Header';
import { useDarkMode } from "../context/DarkModeContext";
const ViewAll = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
    const { isDarkMode } = useDarkMode();
  useEffect(() => {
    const fetchAllPosts = async () => {
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

        // Directly set all posts from the response
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);
 

  const searchWords = searchQuery.trim().toLowerCase().split(/\s+/);

  const filteredPosts = posts.filter(post =>
    searchWords.some(word =>
      (post.author?.name?.toLowerCase().includes(word) || '') ||
      (post.title?.toLowerCase().includes(word) || '') ||
      (post.content?.toLowerCase().includes(word) || '')
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader/>
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
    <div className={`h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Header onSearch={setSearchQuery} />
        <div className="w-full mt-4 flex-1 overflow-y-auto z-10">
          {loading && <Loader />}
          {error && <p className="text-xl text-red-500">{error}</p>}
          {!loading && !error && (
            <PostList posts={filteredPosts} setPosts={setPosts} />
          )}
        </div>
      </div>
  );
};

export default ViewAll;
