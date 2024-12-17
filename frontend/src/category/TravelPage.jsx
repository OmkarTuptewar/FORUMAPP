import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loadermodal';
import PostForm from '../components/PostForm';
import Header from '../components/Header';
import { useDarkMode } from "../context/DarkModeContext";

const TravelPage = () => {
  const [posts, setPosts] = useState([]);
  const { isDarkMode } = useDarkMode();  // Dark mode support
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // Added search functionality

  const handleNewPostSubmission = () => {
    setNewPost(prevState => !prevState);
  };

  // Fetch posts with travel category
  useEffect(() => {
    const fetchTravelPosts = async () => {
      try {
        setLoading(true);
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

        // Filter posts with category 'Travel'
        const travelPosts = response.data.filter(post => post.category === 'Travel');
        setPosts(travelPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching travel posts:', err);
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchTravelPosts();
  }, [newPost]);

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
        <Loader />
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
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      <div className="flex h-screen overflow-hidden">
        {/* Main Content Section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 lg:ml-60 md:ml-0 right-0 z-20 bg-white">
            <Header onSearch={setSearchQuery} />
          </div>

          {/* Post Form */}
          <div className="relative z-10 mt-10 mb-20">
            <PostForm onSubmit={handleNewPostSubmission} />
          </div>

          {/* List of Posts */}
          <div className="mt-10">
            <PostList posts={filteredPosts} setPosts={setPosts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPage;
