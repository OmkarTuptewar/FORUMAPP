import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loadermodal';
import PostForm from '../components/PostForm';
import Header from '../components/Header';
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from '../context/UserContext';

const WeeklynewsPage = () => {
  const [posts, setPosts] = useState([]);
  const { isDarkMode } = useDarkMode();  // Dark mode support
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // Added search functionality
 const { user } = useUser();
  const handleNewPostSubmission = () => {
    setNewPost(prevState => !prevState);
  };

  // Fetch posts with "Weekly-News" category
  useEffect(() => {
    const fetchWeeklyNewsPosts = async () => {
      try {
        setLoading(true);
        const token = user.token; 
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

        // Filter posts by category "Weekly-News"
        const weeklyNewsPosts = response.data.filter(post => post.category === 'Weekly-News');
        setPosts(weeklyNewsPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching weekly news posts:', err);
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchWeeklyNewsPosts();
  }, [newPost]);

  // Search filter functionality
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
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-orange-50 text-gray-900"}>
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

export default WeeklynewsPage;
