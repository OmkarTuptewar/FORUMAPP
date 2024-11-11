const express = require('express');
const User = require('../models/UserModal'); // Adjust the path according to your project structure
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 

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

module.exports = { register, login, getMe, updateUser };
