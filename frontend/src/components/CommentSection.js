import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import defaultProfile from '../assets/images/user-1.png'; 
import { useUser } from '../context/UserContext'; 
import { useDarkMode } from '../context/DarkModeContext'; 

const CommentSection = ({ postId, initialComments, setComments }) => {
  const { isDarkMode } = useDarkMode(); // Get dark mode status
  const { user } = useUser(); 
  const currentUserId = user ? user._id : null;
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); // Track the comment being replied to

 
  const renderCommentContent = (content) => {
    const regex = /(@[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*)/g; // Match @username (including multi-word usernames)
    
    // Replace each @username with a <span> tag for styling
    const formattedContent = content.replace(regex, (match) => {
      return `<span class="text-blue-600">${match}</span>`; // Wrap @username in a blue <span>
    });

    // Use dangerouslySetInnerHTML to render the formatted string
    return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
  };

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
        {
          content: newComment,
          replyTo: replyTo ? replyTo._id : null, // Include the parent comment's ID if replying
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedComments = response.data.comments; 

      setComments(updatedComments); // Update comments in parent state
      setNewComment(''); // Clear the input field
      setReplyTo(null); // Reset the reply state
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    }
  };

  const handleReply = (comment) => {
    setReplyTo(comment); // Set the comment to reply to
    setNewComment(`@${comment.user.name} :`); // Optionally pre-fill the comment input
  };

  return (
    <div className={`comments-section rounded-lg pt-6 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      {initialComments.length > 0 ? (
        initialComments.map((comment) => (
          <div key={comment._id} className={`flex items-start mb-4 border-b pb-4 last:border-b-0 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <img
              src={comment.user.profilePicture || defaultProfile}
              alt="Profile"
              className="object-cover w-8 h-8 rounded-full shadow-md mr-4"
            />
            <div className="w-full">
              <h3 className={`font-semibold text-sm  ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {comment.user.name || "unknown"}
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {renderCommentContent(comment.content)} {/* Render comment with @username in blue */}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                {new Date(comment.createdAt).toLocaleString()}
              </p>

              {/* Reply Button */}
              <button
                onClick={() => handleReply(comment)}
                className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'} mt-2`}
              >
                Reply
              </button>

              {/* Display replies to this comment */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-2">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="flex items-start mb-2">
                      <img
                        src={reply.user.profilePicture || defaultProfile}
                        alt="Profile"
                        className="object-cover w-8 h-8 rounded-full shadow-md mr-4"
                      />
                      <div>
                        <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {reply.user.name}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {renderCommentContent(reply.content)} {/* Render reply with @username in blue */}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No comments yet.</p>
      )}

      {/* New Comment Form */}
      <form onSubmit={handleCommentSubmit} className="flex items-center mt-6">
        {replyTo && (
          <div className="mb-2 text-xs text-gray-600 m-3">
            Replying to <strong>{replyTo.user.name}</strong>
          </div>
        )}
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? `Reply to @${replyTo.user.name}...` : 'Add a comment...'}
          className={`flex-grow border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-full text-black p-1 mr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-600 text-white  rounded-full px-4 py-1 transition duration-300 ${isDarkMode ? 'hover:bg-blue-400' : ''}`}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
