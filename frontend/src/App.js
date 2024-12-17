import React, { useState } from "react";
import { useDarkMode } from "./context/DarkModeContext";
import { useUser } from "./context/UserContext";
import Header from "./components/Header";
import PostForm from "./components/PostForm";
import ViewAllPosts from "./pages/ViewAllPosts";
import backimage from "./assets/images/banner-bg.png";

const App = () => {
  const { user } = useUser();
  const { isDarkMode } = useDarkMode();
  const [newPost, setNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewPostSubmission = () => {
    setNewPost((prevState) => !prevState);
  };

  return (
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      <div className="flex">
        <div className="flex flex-col flex-1 p-4">
          <Header onSearch={setSearchQuery} />
          <div className="relative z-10">
            <img src={backimage} alt="background" className="w-full h-20" />
              <PostForm onSubmit={handleNewPostSubmission} />
          </div>
          <div className="mt-10">
            <ViewAllPosts newPost={newPost} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;


