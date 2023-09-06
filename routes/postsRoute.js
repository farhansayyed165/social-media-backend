const express = require("express");
const {paginateModel} = require("../middleware/paginateModel")
const {getPosts,getPost, createPost, deletePost, updatePost, likePost, addComment, savePost, getUserPosts, paginatedPosts}= require("../controllers/postsController");
const router = express.Router();
const validateToken = require("../middleware/validateToken");
const Post = require("../model/postsModel")
const likes = "likes"



router.get("/getPost/:id", getPost); // api/posts/             //GET

router.get("/getAll", getPosts); // api/posts/                 //GET

router.get("/getUserPosts/:id", getUserPosts); // api/posts/   //GET

router.get("/getPaginatedPosts", paginateModel,paginatedPosts); // api/posts/   //GET

router.post("/", validateToken,createPost);// api/posts/       //POST
// title, content, images, 

router.put("/updatePost/:id",validateToken, updatePost);       //PUT

router.put("/createComment/",validateToken, addComment);       //PUT

router.put("/save/:postId", validateToken, savePost)           //PUT

router.put("/likePost/:id",validateToken, likePost);           //PUT

router.delete("/:id",validateToken ,deletePost);// api/posts/                //DELETE

module.exports = router;