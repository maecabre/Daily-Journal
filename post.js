const mongoose = require('mongoose');

// Schema
const postSchema = new mongoose.Schema({
	title: String,
	body: String
});

// Model/Collection
const Post = new mongoose.model("Post", postSchema);

module.exports = Post;