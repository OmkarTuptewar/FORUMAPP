import React, { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { FaHeart, FaComment, FaBell } from "react-icons/fa"; // Import specific icons
import axios from "axios";
import { useUser } from "../context/UserContext";
import { MdFavorite, MdComment, MdNotifications } from "react-icons/md";
const Notification = () => {
    const { user } = useUser(); 
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const token = user.token;
            if (!user) return;
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/notify/getnotifications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Sort by createdAt (most recent first)
            const sortedNotifications = response.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotifications(sortedNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const token = user.token;
            if (!user || !token) return;
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/notify/${notificationId}/marknotificationasread`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) fetchNotifications();
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-200"
            >
                <BellIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                {notifications.some((notif) => !notif.read) && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-700"></span>
                )}
            </button>

            {isDropdownOpen && (
            <div
            className={`absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden z-50`}
        >
            <div className="px-4 py-3 font-bold text-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-700">
                Notifications
            </div>
            <ul className="max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <li
                            key={notification._id}
                            className={`px-4 py-3 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                                notification.read ? "opacity-70" : "font-bold"
                            }`}
                            onClick={() => markAsRead(notification._id)}
                        >
                            {/* Icon based on notification type */}
                            <span className="p-1">
                                {notification.type === "like" ? (
                                    <MdFavorite  className="w-4 h-4 text-red-500" />
                                ) : notification.type === "comment" ? (
                                    <MdComment  className="w-4 h-4 text-blue-500" />
                                ) : (
                                    <FaBell className="w-4 h-4 text-green-500" />
                                )}
                            </span>
                            {/* Notification message and timestamp */}
                            <div className="flex flex-col">
                                <span>{notification.message}</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 text-center">
                        No new notifications
                    </li>
                )}
            </ul>
        </div>
         
            )}
        </div>
    );
};

export default Notification;
