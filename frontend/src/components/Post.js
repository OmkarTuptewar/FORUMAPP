// src/components/Post.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaEllipsisH } from 'react-icons/fa';

import likeIcon from '../assets/images/like.png';
import commentIcon from '../assets/images/comment.png';
import shareIcon from '../assets/images/share.png';
import sendIcon from '../assets/images/send.png';
import defaultProfile from '../assets/images/user-1.png';
import { useUser } from '../context/UserContext';
import CommentSection from './CommentSection';
import EditPostModal from './EditPostModal';
// import EditPostModal from './EditPostModal';

const Post = ({ post, setPosts }) => {
  const { user } = useUser();
  const currentUserId = user ? user._id : null;

  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit Modal


  // Like/unlike post handler
  const handleLike = async () => {
    if (!currentUserId) {
      toast.error('You need to be logged in to like a post.', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token missing. Please log in.', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const hasLiked = post.likes.includes(currentUserId);
      const updatedLikes = hasLiked
        ? post.likes.filter((id) => id !== currentUserId)
        : [...post.likes, currentUserId];

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        )
      );

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
      
      toast.success(hasLiked ? 'Post unliked successfully!' : 'Post liked successfully!', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      toast.error('Failed to like the post. Please try again.', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Share post handler
  const handleShare = () => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        toast.success('Post URL copied to clipboard!', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch(() => {
        toast.error('Failed to copy URL. Please try manually.', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  // Delete post handler
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setTimeout(() => {
          toast.error('Authentication token missing. Please log in.', {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }, 3000);
        return;
      }

      await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/delete/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));

     
        toast.success('Post deleted successfully!', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      
      
    } catch (error) {
    
        toast.error('Failed to delete the post. Please try again.', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  
    }
  };

    
  // Edit post handler
    const handleEdit = async (editedData) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication token missing. Please log in.', {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }

        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/posts/${post._id}`,
          editedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedPost = response.data;
        // Update posts state to reflect changes immediately in the UI
        setPosts((prevPosts) =>
          prevPosts.map((item) =>
            item._id === updatedPost._id ? { ...item, ...updatedPost } : item
          )
        );
        toast.success('Post updated successfully!', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setIsEditModalOpen(false); // Close the modal after saving
      } catch (error) {
        toast.error('Failed to update the post. Please try again.', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };


  const hasUserLiked = post.likes.includes(currentUserId);
  const isAuthor = currentUserId === post.author?._id;
  return (
    <>
  
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out relative">
      {/* User Profile Section */}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Profile Image */}
          <img
            src={post.author?.profilePicture || defaultProfile}
            alt="Profile"
            className="object-cover w-16 h-16 rounded-full shadow-md border-2 border-gray-200"
          />
          {/* Author Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {post.author?.name || 'Unknown Author'}
            </h2>
            <p className="text-sm text-gray-600">{post.author?.about || 'No details available'}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>  
          </div>
        </div>
        {/* Options Button */}
        <div className="relative">
          <button
            title="Open options"
            type="button"
            className="text-gray-500 hover:text-gray-700 transition duration-200"
            onClick={() => setIsOptionsMenuVisible(!isOptionsMenuVisible)}
          >
            <FaEllipsisH className="w-6 h-6" />
          </button>
          {/* Options Menu */}
          {isOptionsMenuVisible && isAuthor && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                 setIsEditModalOpen(true)
                  setIsOptionsMenuVisible(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setIsOptionsMenuVisible(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Post Content Section */}
      <div className="flex flex-col lg:flex-row lg:space-x-6 mb-4">
        {/* Post Image */}
        {post.image && (
          <div className="lg:w-1/3 mb-4 lg:mb-0">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-64 lg:h-48 rounded-lg"
            />
          </div>
        )}
        {/* Post Text */}
        <div className="lg:w-2/3">
          <h3 className="font-bold text-2xl text-gray-800 mb-2">{post.title}</h3>
          <p className="text-gray-700">{post.content || 'No content available.'}</p>
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="flex justify-between items-center border-t pt-4 mt-4 space-x-4">
        {/* Like Button */}
        <button
          type="button"
          title="Like post"
          className="flex items-center space-x-1 hover:text-blue-600 transition duration-200"
          onClick={handleLike}
        >
          <img
            src={likeIcon}
            alt="Like"
            className={`w-6 h-6 ${hasUserLiked ? 'text-blue-600' : 'text-gray-400'}`}
          />
          <span className="text-gray-600">{post.likes.length} Likes</span>
        </button>

        {/* Comment Button */}
        <button
          type="button"
          title="Comment on post"
          className="flex items-center space-x-1 hover:text-gray-700 transition duration-200"
          onClick={() => setIsCommentSectionVisible(!isCommentSectionVisible)}
        >
          <img src={commentIcon} alt="Comment" className="w-6 h-6" />
          <span className="text-gray-600">{post.comments.length} Comments</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          title="Share post"
          className="flex items-center space-x-1 hover:text-gray-700 transition duration-200"
          onClick={handleShare}
        >
          <img src={shareIcon} alt="Share" className="w-6 h-6" />
          <span className="text-gray-600">Share</span>
        </button>

        {/* Send Button */}
        <button
          type="button"
          title="Send post"
          className="flex items-center space-x-1 hover:text-gray-700 transition duration-200"
        >
          <img src={sendIcon} alt="Send" className="w-6 h-6" />
          <span className="text-gray-600">Send</span>
        </button>
      </div>

      {/* Comments Section */}
      {isCommentSectionVisible && (
        <CommentSection
          postId={post._id}
          initialComments={post.comments}
          setComments={(newComments) => {
            setPosts((prevPosts) =>
              prevPosts.map((p) => (p._id === post._id ? { ...p, comments: newComments } : p))
            );
          }}
        />
      )}


       {/* Edit Post Modal */}
       {isEditModalOpen && (
  <EditPostModal
    initialData={post} // Pass the initial post data here
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    onSave={handleEdit}
  />
)}


     
    </div>
    </>
  );
};

export default Post;
