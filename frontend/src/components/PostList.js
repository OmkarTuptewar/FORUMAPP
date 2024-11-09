import React, { useState } from 'react';
import Post from './Post'; // Ensure the path is correct
import Sidebar from './Sidebar';
import EditPostModal from './EditPostModal';

const PostList = ({ posts, setPosts, onEditPost }) => {
  const [editingPost, setEditingPost] = useState(null);

  const openEditModal = (post) => {
    setEditingPost(post);
  };

  const closeEditModal = () => {
    setEditingPost(null);
  };

  const handlePostEdit = (editedData) => {
    setPosts((prevPosts) => 
      prevPosts.map((post) => post._id === editedData._id ? editedData : post)
    );
    setEditingPost(editedData);  // Ensure the modal gets the updated post
    closeEditModal();
  };

  return (
    <div className="flex">
    <main className="w-full lg:w-5/6 p-4 h-screen mr-20 ml-20">
      <div className="grid grid-cols-1 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post._id} post={post} setPosts={setPosts} openEditModal={openEditModal} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            <p>No posts available.</p>
          </div>
        )}

        {/* Edit Post Modal */}
        {editingPost && (
          <EditPostModal
            isOpen={!!editingPost}
            onClose={closeEditModal}
            onSave={(editedData) => {
              // Pass the edited post data to the parent to update immediately
              onEditPost(editedData);
              closeEditModal(); // Close the modal after saving
            }}
            initialData={editingPost}
          />
        )}
      </div>
    </main>
  </div>
  );
};

export default PostList;