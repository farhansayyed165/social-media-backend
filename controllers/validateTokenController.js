require("dotenv").config()
const asyncHandler =  require("express-async-handler");

const CheckToken = asyncHandler(async (req,res)=>{
    const loggedIn = req.goodUser;
    if(loggedIn){
        res.status(200)
    }
})

module.exports = CheckToken;