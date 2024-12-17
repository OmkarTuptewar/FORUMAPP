// src/components/Post.js
import React, { useState,useRef  } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaEllipsisH } from 'react-icons/fa';
import likeIcon from '../assets/images/like.png';
import commentIcon from '../assets/images/comment.png';
import shareIcon from '../assets/images/share.png';
import sendIcon from '../assets/images/send.png';
import defaultProfile from '../assets/images/user-1.png';
import { useUser } from '../context/UserContext';


import { useDarkMode } from '../context/DarkModeContext';
import EditPostModal2 from './EditPostModal2';
import CommentSection from '../components/CommentSection';
// import EditPostModal from './EditPostModal';


const Post2 = ({ post, setPosts }) => {
  const { user } = useUser();
  const {isDarkMode} = useDarkMode(); // Get dark mode state
  const currentUserId = user ? user._id : null;

  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit Modal
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportPosition, setReportPosition] = useState({ top: 0, left: 0 });
  const reportButtonRef = useRef(null);

  const handleReport = () => {
    if (reportButtonRef.current) {
      const { top, left, height } = reportButtonRef.current.getBoundingClientRect();
      setReportPosition({ top: top + height, left });
      setIsReportModalVisible(true);
    }
  };

  const submitReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Please enter a reason for reporting.', {
        position: 'bottom-right',
        autoClose: 5000,
      });
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token missing. Please log in.', {
          position: 'bottom-right',
          autoClose: 5000,
        });
        return;
      }
  
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${post._id}/report`,
        { reason: reportReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success('Post reported successfully!', {
        position: 'bottom-right',
        autoClose: 5000,
      });
  
      setIsReportModalVisible(false);
      setReportReason('');
    } catch (error) {
      toast.error('Failed to report the post. Please try again.', {
        position: 'bottom-right',
        autoClose: 5000,
      });
    }
  };

  const closeReportModal = () => setIsReportModalVisible(false);

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
  
  <div
  className={`${
    isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
  } rounded-lg shadow p-4  pb-2 hover:shadow-lg transition-shadow duration-300 ease-in-out relative`}
>
  {/* User Profile Section */}
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center space-x-3">
      {/* Profile Image */}
      <img
        src={post.author?.profilePicture || defaultProfile}
        alt="Profile"
        className="object-cover w-12 h-12 rounded-full border border-gray-200"
      />
      {/* Author Info */}
      <div>
        <h2 className="text-sm font-medium">{post.author?.name || 'Unknown Author'}</h2>
        <p className="text-xs">{post.author?.about || 'No details available'}</p>
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
        <FaEllipsisH className="w-5 h-5" />
      </button>
      {isOptionsMenuVisible && (
  <div
    className={`absolute right-0 -mt-2 w-24 ${
      isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'
    } border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-md shadow-lg z-10`}
  >
    {isAuthor ? (
      <>
        <button
          onClick={() => {
            setIsEditModalOpen(true);
            setIsOptionsMenuVisible(false);
          }}
          className="w-full text-left px-3 py-1 border-t hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          onClick={() => {
            handleDelete();
            setIsOptionsMenuVisible(false);
          }}
          className="w-full text-left px-3 py-1 border-t text-red-600 hover:bg-gray-100"
        >
          Delete
        </button>
      </>
    ) : (
      <button
        ref={reportButtonRef}
        onClick={() => {
          handleReport();
          setIsOptionsMenuVisible(false);
        }}
        className="w-full text-left px-3 py-1 border-t text-red-600 hover:bg-gray-100"
      >
        Report!
      </button>
    )}
  </div>
)}

    </div>
  </div>

 {/* Post Content Section */}
<div className="flex flex-col lg:flex-row lg:space-x-4 mb-2 items-start">
  {/* Post Image */}
  {post.image && (
    <div className="lg:w-1/8 mb-3 lg:mb-0 flex-shrink-0">
      <img
        src={post.image}
        alt={post.title}
        className="object-cover w-full h-20 rounded-lg"
      />
    </div>
  )}

  {/* Post Text */}
  <div className={`lg:${post.image ? 'w-2/3' : 'w-full'} flex-grow`}>
    <h3 className="font-semibold text-sm">{post.title}</h3>
    <p className="text-xs">{post.content || 'No content available.'}</p>
  </div>
</div>



  {/* Interaction Buttons */}
  <div className="flex flex-wrap justify-between items-center border-t pt-2  space-x-2 text-xs">
    <button
      type="button"
      title="Like post"
      className="flex items-center space-x-1 hover:text-gray-400 transition duration-200"
      onClick={handleLike}
    >
      <img
        src={likeIcon}
        alt="Like"
        className={`w-4 h-4 ${hasUserLiked ? 'text-gray-600' : 'text-gray-400'}`}
      />
      <span>{post.likes.length} Likes</span>
    </button>
    <button
      type="button"
      title="Comment on post"
      className="flex items-center space-x-1 hover:text-gray-400 transition duration-200"
      onClick={() => setIsCommentSectionVisible(!isCommentSectionVisible)}
    >
      <img src={commentIcon} alt="Comment" className="w-4 h-4" />
      <span>{post.comments.length} Comments</span>
    </button>
    <button
      type="button"
      title="Share post"
      className="flex items-center space-x-1 hover:text-gray-400 transition duration-200"
      onClick={handleShare}
    >
      <img src={shareIcon} alt="Share" className="w-4 h-4" />
      <span>Share</span>
    </button>
    <button
      type="button"
      title="Send post"
      className="flex items-center space-x-1 hover:text-gray-400 transition duration-200"
    >
      <img src={sendIcon} alt="Send" className="w-4 h-4" />
      <span>Send</span>
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
    <EditPostModal2
      initialData={post}
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      onSave={handleEdit}
    />
  )}
</div>


  {isReportModalVisible && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div
        className={`${
          isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
        } w-96 p-4 rounded-lg shadow-lg`}
      >
        <h2 className="text-lg font-semibold mb-3">Report Post</h2>
        <textarea
          className={`w-full h-20 p-2 border rounded ${
            isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
          }`}
          placeholder="Enter the reason for reporting this post..."
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="px-4 py-2 text-sm font-medium rounded bg-gray-300 hover:bg-gray-400"
            onClick={() => setIsReportModalVisible(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded bg-red-500 text-white hover:bg-red-600"
            onClick={submitReport}
          >
            Submit
          </button>
        </div>
    </div>
  </div>
)}


    </>
  );
};

export default Post2;  
