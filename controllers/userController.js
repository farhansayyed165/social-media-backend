require("dotenv").config()
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createUser = asyncHandler(async (req, res, next) => {
    // Extracting and Checking if the email and passwords exist
    const { fullname, avatar, email, password, gender, username, subText, about } = req.body;
    // if any on of it doesn't exist, we throw an error and add return a status of 400
    if (!email || !password || !fullname || !gender || !username) {
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    // The following lines are checking if the email has already been used
    const userE = await User.findOne({ email });
    const userU = await User.findOne({ username });
    // if the email exists, we throw an error
    if (userE || userU) {
        res.status(400);
        throw new Error("Email already registered")
    }

    // If everything is good, we can continue and create a user
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const newUser = await User.create({
        fullname,
        username,
        email,
        about,
        subText,
        password: hashedPassword,
        avatar,
        gender
    })
    console.log(newUser)

    if (newUser) {
        res.status(201).json({ message: "User Created Succefully", user: newUser })
    } else {
        res.status(400)
        throw new Error("User data is not valid")
    }

    // res.status(201).json({message:"User Created Succesfully"})
});


const loginUser = asyncHandler(async (req, res, next) => {
    console.log(req.headers)
    // Extracting and Checking if the email and passwords exist
    const { email, password } = req.body;
    // if any on of it doesn't exist, we throw an error and add return a status of 400
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    // The following lines are checking if the email exists
    const user = await User.findOne({ email });
    // if the email exists, we throw an error
    if (user && bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign(
            {
                user
            },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        )
        res.status(200).json({ accessToken, user })
    }
    else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
    // res.status(200).json({message:"User logged in Succesfully"})
})

const checkPassword = asyncHandler(async (req, res) => {
    // Extracting and Checking if the email and passwords exist
    const { email, password, newPassword } = req.body;
    // if any on of it doesn't exist, we throw an error and add return a status of 400
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    console.log(email, password)

    // The following lines are checking if the email exists
    const user = await User.findOne({ email });
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(user)
    if(!user){
        res.status(404)
        throw new Error("account not found")
    }
    console.log(password, user.password)
    if(await bcrypt.compare(password, user.password)){
        const hashedPassword = await bcrypt.hash(newPassword, 10);        
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {password:hashedPassword},
            { new: true }
        );
        res.json(updatedUser).status(200)
    }
    else{
        res.status(401)
        throw new Error("passwords don't match")
    }


})

const viewProfile = asyncHandler(async (req, res) => {
    const id = req.user._id
    const details = await User.findById(id);
    if (!details) {
        res.status(404)
        throw new Error("User data is not valid")
    }
    details.password = null;
    res.status(200).json(details)
})

const viewProfileUsername = asyncHandler(async (req, res) => {
    const username = req.params.username
    const details = await User.findOne({ username });
    if (!details) {
        res.status(404)
        throw new Error("User data is not valid")
    }
    details.password = null;
    res.status(200).json(details)
})

const viewProfileId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const details = await User.findById(id)
    if (!details) {
        res.status(404)
        throw new Error("User data is not valid")
    }
    details.password = null;
    res.status(200).json(details)
})

const updateUser = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedUser)
})

const deleteUser = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
        res.status(404)
        throw new Error("User data is not valid")
    }
    await User.deleteOne();
    res.json(user).status(200);
});

const followUserHandler = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const toFollowId = req.params.toFollowId

    const user = await User.findById(userId);
    const toFollowUser = await User.findById(toFollowId)
    if (!user || !toFollowUser) {
        res.status(404)
        throw new Error("User data is not valid")
    }

    let signedUserFollowingArray = user.following;

    let toFollowUserFollowersArray = toFollowUser.followers;

    console.log(toFollowUserFollowersArray.length)
    console.log(typeof signedUserFollowingArray)
    const array = [1, 2, 3, 4, 5];
    console.log(array.indexOf(2))
    if (signedUserFollowingArray.includes(toFollowId) && toFollowUserFollowersArray.includes(userId)) {
        console.log("in exception")
        signedUserFollowingArray.splice(signedUserFollowingArray.indexOf(toFollowId), 1)
        console.log("after signed user")
        toFollowUserFollowersArray.splice(toFollowUserFollowersArray.indexOf(userId), 1);

    }
    else {
        signedUserFollowingArray.push(toFollowId)

        toFollowUserFollowersArray.push(userId)
    }

    const updatedToFollowUser = await User.findByIdAndUpdate(
        toFollowId,
        { followers: toFollowUserFollowersArray },
        { new: true }
    );

    const updatedSignedUser = await User.findByIdAndUpdate(
        userId,
        { following: signedUserFollowingArray },
        { new: true }
    );
    res.status(200).json({ updateUser: updatedSignedUser, updatedViewingUser: updatedToFollowUser })
})

const checkIfAllIsOK = asyncHandler(async (req, res) => {
    res.send("all ok")
})



module.exports = {
    createUser,
    loginUser,
    viewProfile,
    viewProfileId,
    viewProfileUsername,
    updateUser,
    deleteUser,
    followUserHandler,
    checkIfAllIsOK,
    checkPassword
}