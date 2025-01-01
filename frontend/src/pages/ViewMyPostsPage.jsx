import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';
import { useUser } from '../context/UserContext';
import { useDarkMode } from "../context/DarkModeContext";
import Loader from '../components/Loadermodal';
import Header from '../components/Header'; // Import Header

const ViewMyPostsPage = () => {
  const { user, logout } = useUser(); // Assuming logout function is available in UserContext
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
    const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user || !user._id) {
        setError('User not found. Please log in.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);
   

  const searchWords = searchQuery.trim().toLowerCase().split(/\s+/);

  const filteredPosts = posts.filter(post =>
    searchWords.some(word =>
      (post.author?.name?.toLowerCase().includes(word) || '') ||
      (post.title?.toLowerCase().includes(word) || '') ||
      (post.content?.toLowerCase().includes(word) || '')
    )
  );
  const handlePostEdit = (editedData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === editedData._id ? editedData : post))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader/>
      </div>
    );
  }



  return (
    <>
     <div className={`h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-orange-50 text-gray-900"}`}>
     
  <Header onSearch={setSearchQuery} />
  <div className="w-full mt-4 flex-1 overflow-y-auto z-20">
    {loading && <Loader />}
    {error && <p className="text-xl text-red-500">{error}</p>}
   
    {!loading && !error && (
      
      <PostList posts={filteredPosts} setPosts={setPosts} onEditPost={handlePostEdit} />
    )}
  </div>
</div>

    </>
  );
};

export default ViewMyPostsPage;
