// controllers/groupController.js
const Group = require('../models/groupModal');
const Post = require('../models/PostModal');
const User = require('../models/UserModal');



const mongoose = require('mongoose');
// Create a group
const createGroup = async (req, res) => {
  const { name, description, details, visibility, allowedDomains } = req.body;
  const userId = req.user._id;

  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required." });
  }

  // Check if a group with the same name already exists
  const existingGroup = await Group.findOne({ name });
  if (existingGroup) {
    return res.status(400).json({ message: "A group with the same name already exists." });
  }


 

  try {
    const newGroup = new Group({
      name,
      description,
      details,
      createdBy: userId,
      visibility,
      accessCriteria: {
        emailDomain: allowedDomains.join(','), // Should handle multiple domains correctly
      },
      members: [userId],
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    console.error('Error creating group:', error); // Log detailed error
    res.status(500).json({ message: 'Error creating group', error: error.message });
  }
};




// Get all groups
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error: error.message });
  }
};

const getGroupsDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Fetch the group details
    const groupDetails = await Group.findById(groupId)
      .populate({
        path: 'createdBy',
        select: 'name email profilePicture', // Include necessary fields of the creator
      })
      .exec();

    if (!groupDetails) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Fetch all posts for the specific group
    const posts = await Post.find({ group: groupId })
      .populate({
        path: 'author',
        select: 'name username profilePicture about', // Include necessary fields of the post author
      })
      .populate({
        path: 'comments.user',
        select: 'name username profilePicture', // Include necessary fields of comment authors
      })
      .sort({ createdAt: -1 }) // Sort posts by creation date, newest first
      .exec();

    // Send group details and posts as response
    res.status(200).json({
      group: groupDetails,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createGroupPost = async (req, res) => {
  const { title, content, image , groupId,tags } = req.body; // Expecting 'image' as a URL string
  const userId = req.user ? req.user._id : null; // Ensure user is authenticated

  console.log("Creating post with userId:", userId);
  console.log("Request Body:", req.body);
  // No need to log 'req.file' since we're not handling file uploads here

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Validate required fields
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Create a new post document
    const newPost = new Post({
      author: userId,
      group: groupId,
      title,
      content,
      tags,
      image, // Image URL from frontend  
    });

    // Save the new post to the database
    await newPost.save();

    // Send the created post back as a response
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ message: "Failed to create post", error: error.message });
  }
};


const verifyGroupAccess = async (groupId, userEmail) => {
  try {
    // Fetch the group by ID
    const group = await Group.findById(groupId);

    if (!group) {
      return { status: 404, message: 'Group not found' };
    }

    // Check if the group is public or private
    if (group.visibility === 'public') {
      // If the group is public, allow access
      return { status: 200, canAccess: true };
    }

    // Extract the domain from the user's email
    const userDomain = userEmail.split('@')[1];

    // Get the required domains for access from the group
    const requiredDomains = group.accessCriteria.emailDomain.split(',');

    // Check if the user's email domain matches the required domains
    if (requiredDomains.includes(userDomain)) {
      return { status: 200, canAccess: true };
    } else {
      return { status: 403, message: 'You do not have access to this group.' };
    }
  } catch (error) {
    console.error('Error verifying group access:', error);
    return { status: 500, message: 'Internal server error' };
  }
};



///calendar 

const getGroupById = async (groupId) => {
  try {
    // Check if groupId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      throw new Error('Invalid groupId format');
    }

    const group = await Group.findById(groupId).populate({
      path: 'events.members', // Populate the 'members' field
      select: 'name profilePicture email', // Only include the 'name' field of the user
    });

    // Check if the group exists
    if (!group) {
      throw new Error('Group not found');
    }

    return group;
  } catch (error) {
    throw new Error(`Error fetching group: ${error.message}`);
  }
};

// Fetch all events for a specific group
const fetchEvents = async (req, res) => {
  try {
    const group = await getGroupById(req.params.groupId);
    res.status(200).json(group.events); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add a new event to a group
const addEvent = async (req, res) => {
  try {
    const { date, name, description, imageUrl } = req.body;
    const group = await getGroupById(req.params.groupId);
    const userId = req.user._id;
    const newEvent = {
      date: new Date(date), // Ensure date is properly formatted
      name,
      description,
      imageUrl,
      createdBy: userId,
    };

    group.events.push(newEvent);
    await group.save();

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event', error: error.message });
  }
};



// Delete an event (only if the user is the creator)
const deleteEvent = async (req, res) => {
  try {
    const { groupId, eventId } = req.params;
    console.log('groupId:', groupId, 'eventId:', eventId); // Log the ids

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const event = group.events.id(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
   
    if (String(event.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }

    group.events.pull(eventId);
    await group.save();

    return res.status(204).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting event', error });
  }
};

// Adjusted backend code to ensure 'members' is populated
const joinEvent = async (req, res) => {
  const { groupId, eventId } = req.params;
  const userId = req.user._id; // The user making the request (from the token)

  try {
    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Find the event by ID in the group's events array
    const event = group.events.find(e => e._id.toString() === eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is already a member of the event
    if (event.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already a member of this event' });
    }

    // Add the user to the event's members array
    event.members.push(userId);

    // Save the updated group document
    await group.save();

    // Populate the 'members' field with user details
    const populatedGroup = await Group.findById(groupId).populate({
      path: 'events.members', // Populate the 'members' field
      select: 'name profilePicture email', // Only include the 'name', 'profilePicture', and 'email' fields of the user
    });

    // Find the updated event after population
    const populatedEvent = populatedGroup.events.find(e => e._id.toString() === eventId);

    // Return a success message with the populated event
    return res.status(200).json({
      message: 'User added to the event successfully',
      event: populatedEvent,  // Return the populated event
    });

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};




module.exports = { createGroup, getGroups,getGroupsDetails,createGroupPost,verifyGroupAccess,addEvent,deleteEvent,fetchEvents,joinEvent };
