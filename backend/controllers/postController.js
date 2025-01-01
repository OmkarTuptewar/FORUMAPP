const Post = require("../models/PostModal"); 
const cloudinary = require("../config/cloudinary.js"); 
const { addNotification } = require('./notificationController.js');

const reportPost = async (req, res) => {
	try {
		const { postId } = req.params;
		const { reason } = req.body;
		const userId = req.user._id;

		if (!reason) {
			return res.status(400).json({ message: "Reason for reporting is required." });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found." });
		}

		// Add report details to the post
		post.reports.push({ reason, reportedBy: userId });
		await post.save();

		res.status(200).json({ message: "Post reported successfully." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error." });
	}
};
// Controller to get all feed posts
const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ group: { $exists: false } }) // Exclude posts with a 'group' field
      .populate({
        path: "author",
        select: "name username profilePicture about", // Only select necessary fields
      })
      .populate({
        path: "comments.user", // Populate the user field in comments
        select: "name username profilePicture", // Select username and profilePicture
      })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

// Controller to create a post with Cloudinary image handling
const createPost = async (req, res) => {
  const { title, content, category, image } = req.body; // Expecting 'image' as a URL string
  const userId = req.user ? req.user._id : null; // Ensure user is authenticated

  console.log("Creating post with userId:", userId);
  console.log("Request Body:", req.body);
  // No need to log 'req.file' since we're not handling file uploads here

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Validate required fields
    if (!title || !category) {
      return res
        .status(400)
        .json({ message: "Title and category are required." });
    }

    // Create a new post document
    const newPost = new Post({
      author: userId,
      title,
      content,
      image, // Image URL from frontend
      category,
      
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

const getPostsByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch posts authored by the user
    const posts = await Post.find({ author: userId })
      .populate("author")
      .populate({
        path: "comments.user", // Populate the user field in comments
        select: "username profilePicture", // Select username and profilePicture
      })
      .sort({ createdAt: -1 });

    // Check if posts were found
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    // Return the posts as a response
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

// Controller to get a post by ID
const getPostById = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId).populate("author").populate({
      path: "comments.user", // Populate the user field in comments
      select: " name username profilePicture", // Select username and profilePicture
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error });
  }
};

// Controller to create a comment on a post
const createComment = async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const userId = req.user._id; // Current user ID

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      content,
      user: req.user._id, // Assuming req.user contains the authenticated user
      createdAt: Date.now(),
    };

    post.comments.push(comment);
    await post.save();

    if (post.author._id.toString() !== userId) {
      await addNotification(
        post.author._id,
        "comment",
        `${req.user.username} commented on your post "${post.title}"`,
        post._id
      );
    }

    // Populate the user details in the response
    const updatedPost = await Post.findById(postId).populate("comments.user");

    res.status(201).json({
      message: "Comment added successfully",
      comments: updatedPost.comments, // Updated comments with user details
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};





// Controller to like a post
const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id; // Current user ID


  try {
    const post = await Post.findById(postId).populate("author").populate({
      path: "comments.user", // Populate the user field in comments
      select: "name username profilePicture", // Select username and profilePicture
    }); // Populate author if needed
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (like) => like.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // If the post is already liked, unlike it
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like the post
      post.likes.push(req.user._id);

 // Notify the post's author if the liker is not the author
 if (post.author._id.toString() !== userId) {
  await addNotification(
    post.author._id,
    "like",
    `${req.user.username} liked your post "${post.title}"`,
    post._id
  );
}


    }

    await post.save();

    // Return the updated post, including populated author
    res.status(200).json(post);
  } catch (error) {
    console.error("Error liking post:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Failed to like post", error: error.message });
  }
};





const editPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id; // Ensure user is authenticated
  const { title, content, category, image } = req.body;

  try {
    // Find the post by ID and populate author and comments user data
    const post = await Post.findById(postId).populate("author").populate({
      path: "comments.user", // Populate the user field in comments
      select: "username profilePicture", // Select username and profilePicture
    });
      // Populate author details
   
    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure that the user can only edit their own post
    if (post.author._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit this post" });
    }

    // Update post details
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.image = image || post.image;

    // Save the updated post
    const updatedPost = await post.save();

 

    // Return the updated post
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ message: "Failed to edit post", error: error.message });
  }
};


// Controller to delete a post by ID
const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id; // Ensure the user is authenticated

  try {
    // Find the post by ID
    const post = await Post.findById(postId);

    // If the post doesn't exist, return a 404 error
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure the post belongs to the user
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    // Use deleteOne instead of remove
    await post.deleteOne(); // or Post.findByIdAndDelete(postId)

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error); // Log the error to check what's wrong
    res
      .status(500)
      .json({ message: "Failed to delete post", error: error.message });
  }
};

module.exports = {
  editPost,
  getFeedPosts,
  createPost,
  deletePost,
  getPostById,
  createComment,
  getPostsByUserId,
  likePost,
  reportPost,
};
