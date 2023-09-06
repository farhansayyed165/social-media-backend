const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true,
        maxlength: 25,
    },
    username:{
        type:String,
        required:[true, "Please give a valid email"],
        unique:true,
        trim:true,
        maxlength:25
    },
    email:{
        type:String,
        required:[true, "Please give a valid email"],
        unique:true,
        trim:true,
    },
    subText:{
        type:String,
        maxlength:400
    },
    about:{
        type:String,
        maxlength:2000
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
    },
    gender:{
        type:String,
        enum:["male","female","other","non-binary","perfer not to answer"],
        default:"perfer not to answer"
    },
    private:{
        type:Boolean,
        default:false
    },
    mobile:{
        type:String,
        default:null
    },
    saved:[{
        type: mongoose.Types.ObjectId,
        ref:"post"
    }],
    followers:[{
        type: mongoose.Types.ObjectId,
        ref:"user"
    }],
    following:[{
        type: mongoose.Types.ObjectId,
        ref:"user"
    }],
    posts:[{
        type:mongoose.Types.ObjectId,
        ref:"post"
    }]
},
{
    timestamps:true,
});

module.exports = mongoose.model("user",userSchema);