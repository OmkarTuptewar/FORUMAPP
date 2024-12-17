const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true }, // Title field
		content: { type: String },
		image: { type: String },
		category: { type: String }, // Free text field for category
		group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Reference to Group
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		comments: [
			{
				content: { type: String },
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				createdAt: { type: Date, default: Date.now },
			},
		],
		reports: [
			{
				reason: { type: String, required: true },
				reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
				createdAt: { type: Date, default: Date.now },
			},
		],
		
		tags: [{ type: String }], // Array of strings for tags
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
