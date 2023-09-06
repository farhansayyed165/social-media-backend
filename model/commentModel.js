const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    postId:{
        type:mongoose.Types.ObjectId,
        ref:"post"
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    addedDate:{
        type:Date,
        required:true,
    },
    user:{
        id:{
            type:mongoose.Types.ObjectId,
            ref:"user"
        },
        username:{
            type:String,
            required:true,
        },
        fullname:{
            type:String,
            required:true,
        },
        avatar:{
            type:String,
            required:true,
        },
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model("comment", commentSchema)