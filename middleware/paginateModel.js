const Post = require("../model/postsModel")
const Comment = require("../model/commentModel")

async function paginateModel(req, res, next) {
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    // console.log(page)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const results = { results: [] }
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit,
        }
    }
    if (endIndex < await Post.countDocuments()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }
    try {

        results.results = await Post.find().limit(limit).skip(startIndex).sort({ likes: -1, updatedAt: -1 }).exec();
        res.paginatedResults = results
        next()
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
}

function paginatedSearch(model, q, selectedFields) {

    return async (req, res, next) => {
        const searchString = req.params.id
        const limit = parseInt(req.query.limit)
        const page = parseInt(req.query.page)
        // console.log(page)
        console.log("inside paginated comments")
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            }
        }
        if (endIndex < await model.countDocuments()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find({[q]: { "$regex": searchString, "$options": "i" } }).select(selectedFields).limit(limit).skip(startIndex).exec()
            res.results = results
            console.log(results)
            next()
        }
        catch (e) {
            res.status(500).json({ message: e.message })
        }
    }

}





async function paginatedCommentModel(req, res, next) {
    const postId = req.params.id
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    // console.log(page)
    console.log("inside paginated comments")
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const results = {}
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit,
        }
    }
    if (endIndex < await Comment.countDocuments()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }
    try {
        results.results = await Comment.find({ postId }).limit(limit).skip(startIndex).sort({ likes: -1, updatedAt: -1 }).exec();
        res.results = results
        next()
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = { paginateModel, paginatedCommentModel, paginatedSearch }