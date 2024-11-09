const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   image: {
      type: String, // Will store image URLs (optional)
   },
   likes: {
      type: Number,
      default: 0,
   },
   comments: [{
      type: String, // Comments array with strings (could be further extended)
   }],
   createdAt: {
      type: Date,
      default: Date.now,
   },
   username: {
      type: String, // Placeholder for profile name (user model can be added later)
      required: true,
   }
});

module.exports = mongoose.model('Question', questionSchema);
