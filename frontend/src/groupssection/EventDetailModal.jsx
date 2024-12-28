import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useUser } from "../context/UserContext";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaShareAlt } from 'react-icons/fa';  // Importing the share icon

const EventDetailModal = ({ event, onClose, onUserJoined }) => {
  const [joining, setJoining] = useState(false);
  const { user } = useUser();
  const token = localStorage.getItem('token');
  const { groupId } = useParams();

  const handleJoin = async () => {
    if (!user || !token) return;

    setJoining(true);

    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/group/${groupId}/join/${event._id}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedEvent = response.data.event;

      // Trigger the callback to update the parent component
      onUserJoined(updatedEvent);

    } catch (err) {
      console.error('Error joining event:', err);
    } finally {
      setJoining(false);
    }
  };

  const handleShare = () => {
    const eventUrl = `${window.location.origin}/joingroups/${groupId}/events/${event._id}`;
    navigator.share({
      title: event.name,
      text: event.description,
      url: eventUrl,
    })
    .catch((error) => console.log('Error sharing event:', error));
  };

  const members = event.members || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-10 w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-7/12 max-w-7xl flex relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
        >
          <MdClose size={30} />
        </button>
  
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-4 left-4 text-gray-700 hover:text-gray-900"
        >
          <FaShareAlt size={24} />
        </button>

        {/* Event Details */}
        <div className="w-full sm:w-1/2 p-6 bg-white rounded-xl">
          {/* Date */}
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">
            {new Date(event.date).toLocaleDateString('en-IN')}
          </p>

          {/* Event Name */}
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{event.name}</h2>

          {/* Event Description */}
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">{event.description}</p>

          {/* Event Image */}
          {event.imageUrl && (
            <div className="w-full h-64 rounded-2xl overflow-hidden shadow-2xl border-r-8 border-l-8 border-neutral-500">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
              />
            </div>
          )}
        </div>

        {/* Members List */}
        <div className="w-full sm:w-1/2 p-6 rounded-xl space-y-2">
          <h3 className="text-xl font-semibold text-gray-600 dark:text-white mb-4 flex items-center space-x-2">
            <span className="text-sm text-gray-500 ml-2">(Total Users)</span>
            <span className="text-indigo-700 font-normal ">{members.length} Interested</span>
          </h3>
          <ul className="space-y-2">
            {members.length > 0 ? (
              members.map((member, index) => (
                <li key={index} className="flex items-center space-x-2 p-1 rounded-lg transition-all duration-300">
                  <img
                    src={member.profilePicture}
                    alt={member.name}
                    className="w-10 h-10 rounded-full border-indigo-800 dark:border-blue-900"
                  />
                  <div>
                    <h3 className="text-md font-mono text-indigo-800 dark:text-white">{member.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{member.email}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-lg text-gray-500">No users have joined yet.</p>
            )}
          </ul>

          {/* Conditionally Render "Join Event" Button */}
          {user && !members.some((member) => member.id === user.id) && (

            <button
              onClick={handleJoin}
              className="mt-8 w-full py-4 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 transition-all duration-300"
              disabled={joining}
            >
              {joining ? 'Joining...' : 'Join Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
