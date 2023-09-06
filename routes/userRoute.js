const express = require("express");
const router = express.Router();
const {createUser, loginUser, updateUser, deleteUser, viewProfileUsername, followUserHandler, checkIfAllIsOK, viewProfileId, checkPassword} = require("../controllers/userController")
const validateToken = require("../middleware/validateToken");

router.post("/signup", createUser); //POST

router.post("/login", loginUser); //POST

router.post("/check-password",validateToken, checkPassword)

router.get("/profile/:username", viewProfileUsername); //GET

router.get("/profile/id/:id", viewProfileId); //GET

router.get("/check/:id", checkIfAllIsOK); //GET

router.put("/update/" , validateToken, updateUser); // PUT

router.get("/follow/:toFollowId", validateToken, followUserHandler) //GET

router.delete("/delete", validateToken, deleteUser) // DELETE

module.exports = router