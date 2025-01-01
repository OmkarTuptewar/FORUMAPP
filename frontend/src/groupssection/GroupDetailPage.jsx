import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDarkMode } from "../context/DarkModeContext";
import { useUser } from "../context/UserContext";
import GroupPostModal from './GroupPostModal';
import axios from 'axios';
import ChatSection from './ChatSection';
import '../index.css';
import Header from '../components/Header';
import PostList2 from './PostList2';
import { FaCalendarAlt, FaComments, FaSort, FaTag } from 'react-icons/fa';
import CalendarWithEvents from './CalendarWithEvents';
import { toast } from 'react-toastify';

const tagsOptions = [
  { value: "All Posts", label: "All Posts" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "other", label: "Other" },
];

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const { isDarkMode } = useDarkMode();
  const { user } = useUser();
  const [groupDetails, setGroupDetails] = useState(null);
  const [posts, setPosts] = useState([]); // State for posts
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal open state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Posts"); // Default to 'All Posts'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const [activeSection, setActiveSection] = useState("calendar"); // Track active toggle
  // Fetch group details and posts function
  const fetchGroupDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/group/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { group, posts } = response.data;

      setGroupDetails(group); // Set group details
      setPosts(posts); // Set posts
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(`Error: ${error.response.data.message || "Unable to fetch group details."}`);
        } else if (error.request) {
          alert("Error: Unable to reach the server. Please try again later.");
        } else {
          alert("Error: Failed to fetch group details. Please check your setup.");
        }
      } else {
        alert(`Unexpected error: ${error.message}`);
      }
    }
  };

  // Fetch group details and posts on component mount
  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);



  const handleCreatePostClick = () => {
 
   
    if (groupDetails?.visibility === 'private') {

    const allowedDomain = groupDetails.accessCriteria?.emailDomain;
    const userEmail = user?.email;
    const userDomain = userEmail.split('@')[1];

    if (userDomain !== allowedDomain) {
      toast.error(`You dont hav an email domain as per the group criteria  to create a post.`);
      return; // Stop the post creation process
    }

  }



    setIsModalOpen(true); // Open the modal to create the post
  };



  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal when called
  };



  const searchWords = searchQuery.trim().toLowerCase().split(/\s+/);

  // Filter posts based on search query and selected tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchWords.some(word =>
      (post.author?.name?.toLowerCase().includes(word) || '') ||
      (post.title?.toLowerCase().includes(word) || '') ||
      (post.content?.toLowerCase().includes(word) || '')
    );

    // Apply tag filter only if selectedTag is not "All Posts"
    const matchesTag = selectedTag === "All Posts" || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const handleCreateGroupPost = () => {
    setIsModalOpen(false); // Close modal after post creation
    fetchGroupDetails(); // Refresh group details and posts after post creation
  };
  const handleToggle = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? null : section));
  };
  
  return (
<div
  className={`group-detail-page p-4 lg:p-6 overflow-y-auto transition-all h-screen duration-300 ${
    isDarkMode ? "bg-gray-900 text-gray-100" : "bg-orange-50 text-gray-800"
  }`}
  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
>
  {/* Fixed Header */}
  <div className="fixed top-0 left-0 lg:ml-60 md:ml-0 right-0 z-20  dark:bg-gray-800 shadow">
    <Header onSearch={setSearchQuery} />
  </div>

  {/* Page Content */}
  <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-16">
    {/* Posts Section */}
    <div className="posts-section flex-grow relative h-[50vh] lg:h-[70vh] w-full">
      <div className="flex flex-col mb-6">
        <h1 className="text-xl lg:text-2xl font-semibold">
          {groupDetails ? groupDetails.name : "Loading..."}
        </h1>
        <p className="text-sm text-gray-500">
          {groupDetails ? groupDetails.description : "Loading..."}
        </p>
      </div>

      {/* Tag Filter Dropdown with Sort Icon */}
      <div className="mb-4 z-20">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-xl p-2 rounded-full focus:outline-none"
          >
            <FaSort />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute py-2 bg-white dark:bg-gray-800 border rounded-lg shadow-lg w-40 z-10">
              {tagsOptions.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => {
                    setSelectedTag(tag.value);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Button */}
      <div className="absolute top-2 right-4 lg:right-8">
        <button
          onClick={handleCreatePostClick}
          className={`py-2 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
            isDarkMode
              ? "bg-blue-500 hover:bg-blue-600 text-gray-100"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Create Post
        </button>
      </div>

      {/* Display Posts */}
      <div className="overflow-y-auto h-[70vh] lg:h-[75vh] w-full -mt-10">
        <PostList2 posts={filteredPosts} setPosts={setPosts} />
      </div>

      {isModalOpen && (
        <GroupPostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateGroupPost}
          groupId={groupId}
        />
      )}
    </div>

    {/* Partition Divider */}
    <div className="hidden lg:block w-px bg-gray-300 dark:bg-gray-600"></div>

    {/* Chat and Calendar Section for Small Screens */}
    <div className="lg:hidden absolute top-16 right-4 z-10">
      <div className="flex justify-end space-x-2 mt-16">
        <button
          onClick={() => handleToggle("calendar")}
          className={`py-2 px-4 rounded-full transition-all duration-300 ${
            activeSection === "calendar" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          aria-label="Toggle Calendar"
        >
          <FaCalendarAlt />
        </button>
        <button
          onClick={() => handleToggle("chatbox")}
          className={`py-2 px-4 rounded-full transition-all duration-300 ${
            activeSection === "chatbox" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          aria-label="Toggle Chatbox"
        >
          <FaComments />
        </button>
      </div>
      <div className="mt-4">
        {activeSection === "calendar" && (
          <CalendarWithEvents groupDetails={groupDetails} />
        )}
        {activeSection === "chatbox" && <ChatSection />}
      </div>
    </div>

    {/* Display both for larger screens */}
    <div className="hidden lg:flex flex-col space-y-4 ">
      <CalendarWithEvents groupDetails={groupDetails} />
      <ChatSection />
    </div>
  </div>
</div>

   
  );
};

export default GroupDetailPage;
