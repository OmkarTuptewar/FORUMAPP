import React, { useState } from "react";
import Header from "./components/Header";
import PostForm from "./components/PostForm";
import ViewAllPosts from "./pages/ViewAllPosts";
import backimage from "./assets/images/banner-bg.png";
import { useUser } from "./context/UserContext"; 

const App = () => {
  const { user } = useUser(); 
  const [newPost, setNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state

  const handleNewPostSubmission = () => {
    setNewPost((prevState) => !prevState); 
  };

  return (
    <>
      {user ? (
        <div className="flex">
          <div className="flex flex-col flex-1 p-4">
            <Header onSearch={setSearchQuery} /> {/* Pass setSearchQuery to Header */}
            <div className="relative z-10">
              <img src={backimage} alt="background image" className="w-full h-auto" />
              <PostForm onSubmit={handleNewPostSubmission} /> 
            </div>
            <div className="mt-20">
              <ViewAllPosts newPost={newPost} searchQuery={searchQuery} /> {/* Pass searchQuery */}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-xl font-semibold">Please log in to access the content</h2>
        </div>
      )}
    </>
  );
};

export default App;
