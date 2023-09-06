const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
    content:{
        type:String,
        required:[true, "Please add a body to the post"],
        maxlength:5000,
    },
    images:{
        type:Array,
        default:[]
    },
    addedDate:{
        type:Date,
        required:true,
    },
    likes:[{
        type:mongoose.Types.ObjectId,
        ref:"user",
    }],
    comments:[{
        type:mongoose.Types.ObjectId,
        ref:"comment"
    }],
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    user:{
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
        id:{
            type:mongoose.Types.ObjectId,
            ref:"user"
        }
    }

},
{
    timestamps:true,
});

module.exports = mongoose.model("post", postsSchema);