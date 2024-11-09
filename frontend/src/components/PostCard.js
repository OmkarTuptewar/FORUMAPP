import React from 'react';

const PostCard = ({ post }) => {
   return (
      <div className="border p-4 mb-4 rounded-lg">
         <h2 className="text-xl font-semibold">{post.title}</h2>
         <p className="text-sm text-gray-600">{post.username}</p>
         <p className="mt-2">{post.description}</p>
         {post.image && (
            <img
               src={URL.createObjectURL(post.image)}
               alt="Post"
               className="mt-4 max-h-60 object-cover"
            />
         )}
         <div className="mt-4 flex space-x-4">
            <button className="text-blue-500">Like</button>
            <button className="text-gray-500">Comment</button>
         </div>
      </div>
   );
};

export default PostCard;
