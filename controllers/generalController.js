require("dotenv").config()
const asyncHandler =  require("express-async-handler");
const User = require("../model/userModel")
const Post = require("../model/postsModel")

const searchdb = asyncHandler(async(req,res)=>{
    const searchString = req.params.search
    if(!searchString){
        res.status(404)
        throw new Error("Search is undefined")
    }
    const results = await User.find({"fullname":{"$regex":searchString, "$options":"i"}}).select("fullname username avatar").limit(5)
    console.log(results)
    res.json(results).status(200)
})

const searchPosts = asyncHandler(async(req,res)=>{
    const searchString = req.params.search
    if(!searchString){
        res.status(404)
        throw new Error("Search is undefined")
    }

    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    const startIndex = (page-1) * limit
    const endIndex = page * limit
    const results = {}
    if(startIndex>0){
        results.previous = {
            page:page-1,
            limit: limit,
        }
    }
    if(endIndex < await Post.countDocuments() && endIndex<await User.countDocuments()){
        results.next = {
            page:page+1,
            limit:limit
        }
    }
    
    const posts = await Post.find({"content":{"$regex":searchString, "$options":"i"}}).select("_id title content images").limit(limit).skip(startIndex).sort({likes:-1, updatedAt:-1}).exec()
    const users = await User.find({"fullname":{"$regex":searchString, "$options":"i"}}).select("_id fullname username email avatar").limit(limit).skip(startIndex).exec()
    results.results = {posts, users}
    res.json(results).status(200)
})

const searchUsers = asyncHandler(async(req,res)=>{
    res.json(res.results).status(200)
})


module.exports = {searchdb, searchUsers}