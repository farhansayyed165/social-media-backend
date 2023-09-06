const asyncHandler = require("express-async-handler");
const Post = require("../model/postsModel");
const Comment = require('../model/commentModel')
const User = require("../model/userModel")

const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({likes:-1});
    if (posts) {
        res.status(200).json(posts)
    }
    else {
        res.status(404).json({error:"Can't find any posts"})
        throw new Error("Can't find any Posts")
    }
});


const getPost = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(404)
        throw new Error("Can't find any Post")
    }
    const post = await Post.findById(id);
    res.status(200).json(post)
});



const getUserPosts = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(404)
        throw new Error("Can't find any Post")
    }
    const id = req.params.id
    const user = await User.findById(id);
    // console.log(user)
    const posts = user.posts
    res.status(200).json(posts)
});



const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    if (!title, !content) {
        res.status(400);
        throw new Error("invalid request. All fields required");
    }
    const userId = req.user._id;
    const user = await User.findById(userId)
    const images = req.body.images ? req.body.images : [];

    const date = new Date().toISOString();
    const userObj = {
        username: user.username,
        fullname:user.fullname,
        avatar:user.avatar,
        id:user._id
    }
    const post = await Post.create({
        title, content, images, addedDate: date, user:userObj
    });
    const posts = user.posts
    posts.push(post._id)
    await User.findByIdAndUpdate(userId,{posts:posts},{new:true})
    res.status(200).json(post);
    console.log("Post ", post)

});

const deletePost = asyncHandler(async (req, res) => {
    if(!(req.params.id)){
        res.status(400)
        throw new Error("No post id provided")
    }
    const userId = req.user._id
    const post = await Post.findById(req.params.id)
    const user = await User.findById(userId)
    if (!post) {
        res.status(404)
        throw new Error("Post not found")
    }
    const postsArray = user.posts
    postsArray.splice(postsArray.indexOf(post._id),1)
    await Post.deleteOne();
    await User.findByIdAndUpdate(userId, {posts:postsArray},{new:true})
    await Comment.deleteMany({postId:req.params.id})
    res.json(post).status(200);
})

const updatePost = asyncHandler(async (req, res) => {
    if(!req.params.id){
        res.status(400)
        console.log("data id is not there")
    }
    console.log(req.params.id)
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error("post not found")
    }
    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(400).json(updatedPost)
})


const likePost = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400)
        throw new Error("Bad Request, can't find any comment with the give ID")
    }
    console.log(req.params.id)
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404)
        throw new Error("comment not found")
    }
    const user = req.user._id;
    console.log(user)
    const likesArray = post.likes;
    if (likesArray.includes(user)) {
        const index = likesArray.indexOf(user);
        likesArray.splice(index, 1);
    }
    else {
        likesArray.push(user);
    }
    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { likes: likesArray },
        { new: true }
    );
    res.status(200).json({ likes: likesArray, post: updatedPost })
});

const addComment = asyncHandler(async (req, res) => {
    const { content, postId } = req.body;
    if (!content || !postId) {
        res.status(400)
        throw new Error("Bad Request, can't find any comment with the give ID")
    }
    const post = await Post.findById(postId);
    if (!post) {
        res.status(404)
        throw new Error("post not found")
    }
    const userId = req.user.id;
    const date = new Date().toISOString();
    const comment = await Comment.create({
        content,
        postId,
        addedDate: date,
        userId
    });
    const comments = post.comments;
    comments.push(comment._id);
    const updatedPost = await Post.findByIdAndUpdate(userId, {
        comments: comments
    },
        { new: true })
    res.status(201).json({ message: "Comment Created successfully!", comment })
})

const savePost = asyncHandler(async (req, res)=>{
        
    const {postId} = req.params;
    const userId = req.user._id
    const user = await User.findById(userId);
    if(!user || !postId){
        res.status(404)
        throw new Error("Can't find post or user")
    }
    const saveArray = user.saved
    if(saveArray.includes(postId)){
        saveArray.splice(saveArray.indexOf(postId),1)
    }
    else{
        saveArray.push(postId)
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {saved:saveArray},
        {new:true}
        )
    res.json({updatedUser}).status(200)
    
})

const paginatedPosts = asyncHandler(async(req,res)=>{
    res.json(res.paginatedResults).status(200)
})

module.exports = { getPosts, getPost, getUserPosts, createPost, deletePost, updatePost, likePost,addComment, savePost,paginatedPosts }