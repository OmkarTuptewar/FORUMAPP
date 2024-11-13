// src/components/CommentSection.js

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import defaultProfile from '../assets/images/user-1.png'; 
import { useUser } from '../context/UserContext'; 

const CommentSection = ({ postId, initialComments, setComments }) => {
  const { user } = useUser(); 
  const currentUserId = user ? user._id : null;
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty!');
      return;
    }

    if (!currentUserId) {
      toast.error('You need to be logged in to comment.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Authentication token missing. Please log in.');
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedComments = response.data.comments; // Assuming response contains updated comments

      setComments(updatedComments); // Update comments in parent state
      setNewComment(''); // Clear the input field
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    }
  };

  return (
    <div className="comments-section rounded-lg  pt-6">
  {initialComments.length > 0 ? (
    initialComments.map((comment) => (
      <div key={comment._id} className="flex items-start mb-4 border-b pb-4 last:border-b-0">
        <img
          src={comment.user.profilePicture || defaultProfile}
          alt="Profile"
          className="object-cover w-10 h-10 rounded-full shadow-md mr-4"
        />
        <div className="w-full">
          <h3 className="font-semibold text-gray-800">{comment.user.username || "unknown"}</h3>
          <p className="text-gray-700">{comment.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-center">No comments yet.</p>
  )}

  {/* New Comment Form */}
  <form onSubmit={handleCommentSubmit} className="flex items-center mt-6">
    <input
      type="text"
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder="Add a comment..."
      className="flex-grow border border-gray-300 rounded-full p-3 mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 transition duration-300">
      Post
    </button>
  </form>
</div>

  );
};

export default CommentSection;
