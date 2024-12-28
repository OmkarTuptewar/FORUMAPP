import React, { useState, useEffect } from "react";
import { useDarkMode } from "./context/DarkModeContext";
import { useUser } from "./context/UserContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "./components/Header";
import PostForm from "./components/PostForm";
import ViewAllPosts from "./pages/ViewAllPosts";
import ViewPostPage from "./pages/ViewPostPage"; // Import ViewPostPage
import backimage from "./assets/images/banner-bg.png";
import axios from 'axios';
import EventDetailModal from "./groupssection/EventDetailModal";

const App = () => {
  const { user } = useUser();
  const { isDarkMode } = useDarkMode();
  const [newPost, setNewPost] = useState(false);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false); // New state for event detail modal
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null); // State for the selected event
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId, postId, eventId } = useParams(); // Use useParams to get dynamic params

  const handleNewPostSubmission = () => {
    setNewPost((prevState) => !prevState);
  };

  const closeModal = () => {
    navigate("/"); // Navigate back to home to close the modal
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/group/${groupId}/events`);
      // Find the event that matches the eventId
      const event = response.data.find(event => event._id === eventId);
      if (event) {
        setSelectedEvent(event);
        setIsEventDetailOpen(true); // Open the modal if the event is found
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };    
  

  useEffect(() => {
    if (eventId) {
      fetchEvents(); // Fetch events and open modal if eventId exists
    }
  }, [eventId]);

  const handleUserJoined = (updatedEvent) => {
    // Update the selected event's members
    setSelectedEvent(updatedEvent);
    fetchEvents(); // Re-fetch the events after the user joins
  };

  return (
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-amber-50 text-gray-900"}>
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

      {/* Conditional Popup for ViewPostPage */}
      {postId && !eventId && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-transparent rounded-lg  w-11/12 max-w-4xl relative  overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute -top-1 right-24 z-20 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <ViewPostPage postId={postId} /> {/* Pass the postId */}
          </div>
        </div>
      )}

      {/* Event Detail Modal for Event Detail Page */}
      {isEventDetailOpen && selectedEvent && eventId && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setIsEventDetailOpen(false)}
          onUserJoined={handleUserJoined} // Pass the callback
        />
      )}
    </div>
  );
};

export default App;
