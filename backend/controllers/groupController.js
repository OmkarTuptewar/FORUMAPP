// controllers/groupController.js
const Group = require('../models/groupModal');
const Post = require('../models/PostModal');

// Create a group
const createGroup = async (req, res) => {
  const { name, description, details } = req.body;
  const userId = req.user._id; // From the middleware (authenticated user)

  try {
    const newGroup = new Group({
      name,
      description,
      details,
      createdBy: userId,
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
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





module.exports = { createGroup, getGroups,getGroupsDetails,createGroupPost };
