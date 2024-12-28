import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loadermodal";
import PostList from "../components/PostList";

const ViewPostPage = ({ postId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`);
        setPosts([response.data]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load the post. Please try again later.");
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-xl text-red-500">{error}</p>;
  }

  return (
    <div >
      {posts.length > 0 && (
        <PostList posts={posts} setPosts={setPosts} />
      )}
    </div>
  );
};

export default ViewPostPage;
