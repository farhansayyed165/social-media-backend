const asyncHandler = require("express-async-handler");
const Comment = require("../model/commentModel");
const Post = require('../model/postsModel')
const User = require("../model/userModel")


const getComment = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(404)
        throw new Error("Can't find any Post")
    }
    const id = req.params.id
    const comment = await  Comment.findById(id);
    // console.log(comment)
    res.status(200).json({ comment })
});

const getComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find();
    if (comments) {
        res.status(200).json(comments)
    }
    else {
        res.status(404)
        throw new Error("Can't find any Posts")
    }

});

const createComment = asyncHandler(async (req, res) => {
    const { content, postId } = req.body;
    if (!content || !postId) {
        res.status(400)
        throw new Error("Bad Request")
    }
    const post = await Post.findById(postId);
    if (!post) {
        res.status(404)
        throw new Error("post not found")
    }
    const userId = req.user._id;
    const user = await User.findById(userId)
    console.log(user)
    const date = new Date().toISOString();
    let comment = await Comment.create({
        content,
        postId,
        addedDate: date,
        username:user.username,
        user:user.fullname
    });
    const commentsArray = post.comments;
    commentsArray.push(comment._id);
    const updatedPost = await Post.findByIdAndUpdate(postId, {
        comments: commentsArray
    },
        { new: true })
    comment = {...comment, userId}
    res.status(201).json({ message: "Comment Created successfully!", comment, updatedPost })
});



const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        res.status(404)
        throw new Error("comment not found")
    }
    await Comment.deleteOne();
    res.json(comment).status(200);
});

const updateComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        res.status(404)
        throw new Error("comment not found")
    }
    const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(400).json(updatedComment)
})


const likeComment = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400)
        throw new Error("Bad Request, can't find any comment with the give ID")
    }
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        res.status(404)
        throw new Error("comment not found")
    }
    const user = req.user.id;
    console.log(user)
    const likesArray = comment.likes;
    if(likesArray.includes(user)){
        const index = likesArray.indexOf(user);
        likesArray.splice(index, 1); 
    }
    else{
        likesArray.push(user);
    }
    const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        {likes:likesArray},
        { new: true }
    );
    res.status(200).json({likes:likesArray.length})
})

const getPostComments = asyncHandler(async (req, res)=>{
    console.log("\n","Results\n",res.results)
    res.json(res.results).status(200)
})

module.exports = {
    getComment,
    getComments,
    createComment,
    deleteComment,
    updateComment,
    likeComment,
    getPostComments
}