import React, { useState, useEffect } from "react";
import axios from "axios";
import AddEventModal from "./AddEventModal";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { MdDelete, MdOutlineDeleteOutline } from "react-icons/md";
import EventDetailModal from "./EventDetailModal"; // Import the EventDetailModal
import { toast } from "react-toastify";
import { useDarkMode } from "../context/DarkModeContext";

const CalendarWithEvents = ({ groupDetails }) => {
  const [events, setEvents] = useState([]);
    const { isDarkMode } = useDarkMode(); // Get dark mode status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false); // New state for event detail modal
  const [selectedEvent, setSelectedEvent] = useState(null); // Store selected event
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { groupId } = useParams();
  const { user } = useUser();
  const token = localStorage.getItem("token");
  const colorPalette = [
    "#880E4F", 
    "#B71C1C", 
    "#1565C0", 
    "#0277BD", 
    "#2C6B29", 
    "#F57C00", 
    "#6A1B9A", 
    "#01579B",
    "#512DA8", 
    "#01579B", 
    "#00695E", 
  ];
  
  

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/group/${groupId}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredEvents = response.data.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      });
      filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(filteredEvents);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate] );

  const handleUserJoined = (updatedEvent) => {
    // Update the selected event's members
    setSelectedEvent(updatedEvent);
    fetchEvents();


  };


  const assignColors = (events) => {
    const colorMap = new Map();
    let colorIndex = 0;

    events.forEach((event) => {
      const dateKey = new Date(event.date).toDateString();
      if (!colorMap.has(dateKey)) {
        colorMap.set(dateKey, colorPalette[colorIndex % colorPalette.length]);
        colorIndex++;
      }
    });

    return colorMap;
  };

  const colorMap = assignColors(events);

  const handleAddEvent = async (newEvent) => {

    if (groupDetails?.visibility === 'private') {
    
        const allowedDomain = groupDetails.accessCriteria?.emailDomain;
        const userEmail = user?.email;
        const userDomain = userEmail.split('@')[1];
    
        if (userDomain !== allowedDomain) {
          toast.error(`You dont hav an email domain as per the group criteria .`);
          return; // Stop the post creation process
        }
    
      }
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/group/${groupId}/addevents`,
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedEvents = [...events, response.data];
      updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(updatedEvents);
    } catch (err) {
      setError("Failed to add event");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/group/${groupId}/deleteevent/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(events.filter((event) => event._id !== eventId));
      } catch (err) {
        setError("Failed to delete event");
      }
    }
  };

  const handleEventClick = (event) => {

    if (groupDetails?.visibility === 'private') {
    
      const allowedDomain = groupDetails.accessCriteria?.emailDomain;
      const userEmail = user?.email;
      const userDomain = userEmail.split('@')[1];
  
      if (userDomain !== allowedDomain) {
        toast.error(`You dont hav an email domain as per the group criteria .`);
        return; // Stop the post creation process
      }
  
    }
    setSelectedEvent(event); // Set the selected event
    setIsEventDetailOpen(true); // Open the event detail modal
  };


  
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  return (
    <div
    className={`max-w-sm p-3 rounded-3xl shadow-lg transition-all duration-300 ${
      isDarkMode
        ? "bg-gradient-to-t from-black-900 via-gray-900 to-gray-900 text-white"
        : "bg-gradient-to-t from-gray-900 via-gray-900 to-gray-900 text-white"
    }`}
  >
    {/* Month and Year Header */}
    <div className="flex items-center justify-between mb-3">
      {/* Previous Month Button */}
      <button
        onClick={() => changeMonth(-1)}
        className="w-6 h-6 rounded-full text-white flex items-center justify-center hover:bg-teal-800 dark:hover:bg-teal-700"
      >
        {"<"}
      </button>
  
      {/* Current Month and Year */}
      <h1
        className={`text-md font-semibold ${
          isDarkMode ? "text-teal-400" : "text-teal-600"
        }`}
      >
        {currentMonth} {currentYear}
      </h1>
  
      {/* Next Month Button */}
      <button
        onClick={() => changeMonth(1)}
        className="w-6 h-6 rounded-full text-white flex items-center justify-center hover:bg-teal-800 dark:hover:bg-teal-700"
      >
        {">"}
      </button>
  
      {/* Add Event Button */}
      <button
        onClick={() => {
          // Check if the group is private and user email domain matches
          if (groupDetails?.visibility === 'private') {
            const allowedDomain = groupDetails.accessCriteria?.emailDomain;
            const userEmail = user?.email;
            const userDomain = userEmail?.split('@')[1];
  
            if (userDomain !== allowedDomain) {
              toast.error(`You don't have an email domain as per the group criteria.`);
              return; // Stop the modal from opening if criteria are not met
            }
          }
  
          // If conditions are met, open the modal
          setIsModalOpen(true);
        }}
        className="w-6 h-6 bg-pink-500 text-white flex items-center justify-center rounded-full hover:bg-pink-600 dark:hover:bg-pink-400 ml-16"
      >
        +
      </button>
    </div>
  
    {/* Loading/Error State */}
    {isLoading && <p className="text-gray-300 text-center text-xs">Loading events...</p>}
    {error && <p className="text-red-500 text-center text-xs">{error}</p>}
  
    {/* Events */}
    <div className="space-y-2 overflow-y-auto h-[30vh] custom-scrollbar">
      {events.length > 0 ? (
        events.map((event) => (
          <div
            key={event._id}
            className="relative flex items-start gap-2 rounded-md transition-all duration-300 cursor-pointer"
            onClick={() => handleEventClick(event)} // Open the event details on click
          >
            {/* Date in a Circle */}
            <div
              className="w-7 h-7 mt-3 flex items-center justify-center text-white font-extrabold rounded-full text-xs"
              style={{ backgroundColor: colorMap.get(new Date(event.date).toDateString()) }}
            >
              {new Date(event.date).getDate()}
            </div>
  
            {/* Event Details */}
            <div
              className="flex flex-col w-5/6 p-2 rounded-lg shadow-sm"
              style={{ backgroundColor: colorMap.get(new Date(event.date).toDateString()) }}
            >
              <div className="flex justify-between items-center w-full">
                {/* Event Name */}
                <p
                  className={`text-xs font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-36px)] ${
                    isDarkMode ? "dark:text-white" : "text-black"
                  }`}
                  title={event.name}
                >
                  {event.name}
                </p>
  
                {/* Show delete icon only if the current user is the creator */}
                {user && user._id === event.createdBy && (
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="text-md hover:bg-red-800 rounded-full p-1"
                  >
                    <MdOutlineDeleteOutline />
                  </button>
                )}
              </div>
  
              {/* Event Description */}
              <p
                className="text-xs text-white mt-1 font-mono overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-48px)]"
                title={event.description}
              >
                {event.description}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center text-xs">No events scheduled</p>
      )}
    </div>
  
    {/* Add Event Modal */}
    {isModalOpen && (
      <AddEventModal
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEvent}
      />
    )}
  
    {/* Event Detail Modal */}
    {isEventDetailOpen && selectedEvent && (
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setIsEventDetailOpen(false)}
        onUserJoined={handleUserJoined} // Pass the callback
      />
    )}

    
  </div>
  
  );
};

export default CalendarWithEvents;
