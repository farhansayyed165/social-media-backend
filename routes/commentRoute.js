const express = require('express');
const router = express.Router();
const validateToken = require("../middleware/validateToken");
const {paginatedCommentModel} = require("../middleware/paginateModel")
const {getComment, getComments,createComment,deleteComment, updateComment, likeComment, getPostComments} = require("../controllers/commentController");

router.get("/", getComments);

router.get("/:id", getComment);

router.get("/infiniteComments/:id",paginatedCommentModel,getPostComments)

router.post("/createComment",validateToken, createComment);

router.put("/update", updateComment);

router.put("/like/:id", likeComment);

router.delete("/:id", deleteComment);

module.exports = router;