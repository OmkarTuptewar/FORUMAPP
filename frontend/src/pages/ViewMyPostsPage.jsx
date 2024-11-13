import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';
import { useUser } from '../context/UserContext';
import { ToastContainer } from 'react-toastify';

const ViewMyPostsPage = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handlePostEdit = (editedData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === editedData._id ? editedData : post))
    );
  };

  return (
    <>
    <ToastContainer />
    <div className=" min-h-screen flex items-center justify-center">
      {loading && <p className="text-xl">Loading...</p>}
      {error && <p className="text-xl text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="w-full p-4 h-[100vh] overflow-y-auto">
          <PostList posts={posts} setPosts={setPosts} onEditPost={handlePostEdit} />
        </div>
      )}
    </div>
  </>
  );
};

export default ViewMyPostsPage;
