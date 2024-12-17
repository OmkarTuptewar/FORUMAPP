const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
      
    },
    email: {
        type: String,
        required: true,
       
    },
    password: {
        type: String,
        required: true,
    },
    about: {
        type: String,
    },
    profilePicture: { // Add this line
        type: String, // URL for the profile picture
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg', // You can set a default URL if needed
    },

    notifications: [
        {
            type: {
                type: String, // e.g., "like", "comment", "general"
                required: true,
            },
            message: {
                type: String, // Customizable notification message
                required: true,
            },
            post: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post', // Optional: Reference to the related post
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            read: {
                type: Boolean,
                default: false, // Track whether the user has read the notification
            },
        },
    ],
        
});


// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
