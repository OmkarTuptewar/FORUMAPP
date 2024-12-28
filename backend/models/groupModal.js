// models/Group.js
const mongoose = require('mongoose');



const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    accessCriteria: {
      emailDomain: { type: String },
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Calendar events
    events: [
      {
        date: { type: String, required: true }, // Event date
        name: { type: String, required: true }, // Event name
        description: { type: String }, // Event description
        imageUrl: { type: String }, // Optional image URL for the event
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the creator of the event
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
