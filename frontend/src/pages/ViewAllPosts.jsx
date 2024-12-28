import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';

import Loader from '../components/Loadermodal';
import '../index.css'
const ViewAllPosts = ({ newPost, searchQuery = '' }) => { // Set a default value for searchQuery
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Remove the authentication token check
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`);
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

  // Split search query into words for "OR" filtering
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full viewport height
          backgroundColor: "#f9f9f9", // Optional background color
        }}
      >
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center ">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[68vh] custom-scrollbar">
  
      
  
      <PostList posts={filteredPosts} setPosts={setPosts} />
    </div>
  );
};

export default ViewAllPosts;
