import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import backimage from "./assets/images/banner-bg.png";
import { useUser } from "./context/UserContext"; // Use the custom hook for user context
import ViewAllPosts from "./pages/ViewAllPosts";

const App = () => {
  const { user } = useUser(); // Get user from context

  // State to manage when new posts are added
  const [newPost, setNewPost] = useState(false);

  // Function to trigger re-render when post is submitted
  const handleNewPostSubmission = () => {
    setNewPost((prevState) => !prevState); // Toggle state to trigger re-render
  };

  return (
    <>
      {/* Conditionally render components based on user's authentication */}
      {user ? (
        <div className="flex">
          {/* Header including Sidebar */}
          {/* Sidebar component can be included here if needed */}

          {/* Main Content (PostForm) */}
          <div className="flex flex-col flex-1 p-4">
            <Header />

            <div className="relative z-10">
              <img
                src={backimage}
                alt="background image"
                className="w-full h-auto"
              />
              <PostForm onSubmit={handleNewPostSubmission} /> {/* Pass down handleNewPostSubmission function */}
            </div>

            <div className="mt-20">
              {/* ViewAllPosts will display the posts */}
              <ViewAllPosts newPost={newPost} /> {/* Pass the newPost state to trigger re-render */}
            </div>
          </div>
        </div>
      ) : (
        // Show message or redirect to login if user is not authenticated
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-xl font-semibold">Please log in to access the content</h2>
        </div>
      )}
    </>
  );
};

export default App;
