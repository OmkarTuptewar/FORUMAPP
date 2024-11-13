const express = require('express');
const User = require('../models/UserModal'); // Adjust the path according to your project structure
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 
const { OAuth2Client } = require('google-auth-library');


// Initialize OAuth2Client with your Google Client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



// Google Login
// Google Login Controller
const googleLogin = async (req, res) => {
    const { token: googleToken } = req.body; // Rename Google token to googleToken
  
    if (!googleToken) {
      return res.status(400).json({ message: 'No token provided' });
    }
  
    try {
      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: googleToken, // Use googleToken here
        audience: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
      });
  
      const payload = ticket.getPayload();
      const { sub, name, email, picture } = payload; // Extract user data from the token
  
      // Check if the user already exists in the database
      let user = await User.findOne({  email });
  
      if (!user) {
        // If not, create a new user without a password and username (or use the name as username)
        user = new User({
          googleId: sub,
          name,
          email,
          username: name, // Optionally use the name from Google as the username
          password: 'omkarTuptewar', //set password for google login
        });
  
        await user.save();
      }
  
      // Generate JWT token for the user (keep the name 'token' for the generated JWT)
      const token = generateToken(user._id);
  
      // Send user details along with the token in the response
      res.status(200).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        about: user.about,
        image:user.profilePicture,
        token,  // Send the JWT token
      });
    } catch (error) {
      console.error('Error during Google login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  


// Register a new user
const register = async (req, res) => {
    const { name, username, email, password, about } = req.body;

    // Validate user input
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({ name, username, email, password, about });

        // Generate JWT
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            about: user.about,
            token,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = generateToken(user._id);
        
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            about: user.about,
            image:user.profilePicture,
            token,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get logged in user
const getMe = async (req, res) => {
    try {
        // Find the user by their ID from the token
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user); // Send the user object without the password
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
const updateUser = async (req, res) => {
    const {name, username, profilePicture, about } = req.body;

    try {
        // Find the user by their ID from the token
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's details
        if (name) user.name = name;
        if (username) user.username = username;
        if (profilePicture) user.profilePicture = profilePicture;
        if (about) user.about = about;

        // Save the updated user
        const updatedUser = await user.save();

        // Return the updated user data (excluding sensitive info)
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            about: updatedUser.about,
            profilePicture: updatedUser.profilePicture,
        });
    } catch (error) {
        console.error("Error updating user:", error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Function to generate JWT
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { register, login, getMe, updateUser,googleLogin };
