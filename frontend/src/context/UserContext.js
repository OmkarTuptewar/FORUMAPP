import React, { createContext, useContext, useState, useEffect } from "react";

// Create a UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// Provider component to wrap your app and provide user data
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load the user data from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to log out the user
  const logout = () => {
    // Clear the user data from localStorage
    localStorage.removeItem("userInfo");

    // Set user state to null
    setUser(null);
  };

  // Function to update user details
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
    localStorage.setItem("userInfo", JSON.stringify({
      ...user,
      ...updatedUserData,
    })); // Update localStorage with new user data
  };

  // Provide user and functions to the context consumers
  return (
    <UserContext.Provider value={{ user, setUser, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
