import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
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
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!user) {
      navigate("/"); 
    }
  }, [user, navigate]); 

  const handleNewPostSubmission = () => {
    setNewPost((prevState) => !prevState);
  };

  return (
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      {user ? (
        <div className="flex">
          <div className="flex flex-col flex-1 p-4">
            <Header onSearch={setSearchQuery} />
            <div className="relative z-10">
              <img src={backimage} alt="background" className="w-full h-auto" />
              <PostForm onSubmit={handleNewPostSubmission} />
            </div>
            <div className="mt-20">
              <ViewAllPosts newPost={newPost} searchQuery={searchQuery} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-xl font-semibold">Please log in to access the content</h2>
        </div>
      )}
    </div>
  );
};

export default App;
