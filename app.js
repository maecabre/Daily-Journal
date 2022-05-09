
// imports
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const config = require(__dirname + "/config");

// import Mongoose Models
const Post = require(__dirname + "/post.js");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();

// Set EJS Engine
app.set('view engine', 'ejs');
// Set Body-Parser
app.use(bodyParser.urlencoded({extended: true}));
// Set Express to allow other custom files
app.use(express.static("public"));


// --------------------------------------------------------
// Main Connection

main().catch(err => console.log(`main() error: ${err}`));
async function main(){

	// Local Connection/DB
	// const myConnection = await mongoose.connect('mongodb://localhost:27017/blogDB');

	// User for local deployment with config import
	const userName = config.userName;
	const escapePassword = config.escapePassword;

	const uri = "mongodb+srv://" + userName + ":" + escapePassword + "@cluster0.c6xf1.mongodb.net/todolistDB?retryWrites=true&w=majority";
	const todoConnection =  await mongoose.connect(uri);
}


// --------------------------------------------------------
// Functions

// Query All
async function getQueryAll(){
	return await Post.find({}, (err, results) => {
		if(err){
			console.log(`getQueryAll(): ${err}`);
		}
	}).clone().catch(err => console.log(`Post.find().clone() error: ${err}`));
}


// --------------------------------------------------------

// GET request, home
app.get("/", async function(req, res){
	// Replace "homeStartingContent" (home.ejs) with "homeStartingContent" (app.js)


	let posts = await getQueryAll();

	res.render("home", {
		homeStartingContent: homeStartingContent,
		posts: posts
	});
});

// GET request, posts
app.get("/posts/:postID", async function(req, res){

	let postsArray = await getQueryAll();

	postsArray.forEach((postObject) =>{
		let storedTitle = _.lowerCase(postObject.title);
		let requestedTitle = _.lowerCase(req.params.postID) ;

		if(storedTitle == requestedTitle){

			res.render("post", {
				title: postObject.title,
				body: postObject.body
			});

		} else{
			// console.log('Match not found');
		}
	});
});

// GET request, about
app.get("/about", function(req, res){
	res.render("about", {aboutContent: aboutContent});
});

// GET request, contact
app.get("/contact", function(req, res){
	res.render("contact", {contactContent: contactContent});
});

// GET request, compose
app.get("/compose", function(req, res){
	res.render("compose");
});


// --------------------------------------------------------

// POST request, home
app.post("/compose", async function(req, res){
	// console.log(req.body);
	let postToPublish = {
		title: req.body.composeInput,
		body: req.body.postInput
	};

	let newPost = new Post(postToPublish);
	await newPost.save((err) => {
		if(!err){
			res.redirect("/");
		} else{
			console.log(`newPost.save() error: ${err}`);
		}
	});

	
});


// --------------------------------------------------------
app.listen(3000, function() {
	console.log("Server started on port 3000");
});
