const express = require("express");
const connectDb = require("./config/dbConnect");
const errorHandler = require("./middleware/errorHandler");
const validateToken = require("./middleware/validateToken");
const CheckToken = require("./controllers/validateTokenController");
const { searchdb, searchUsers } = require("./controllers/generalController");
const {paginatedSearch, paginateModel} = require("./middleware/paginateModel")
const User  = require("./model/userModel")
const Post  = require("./model/postsModel")
connectDb()
const se = "_id fullname username email avatar"
const content = "_id title content images likes comments"
const app = express();
// app.use(cookieParser())
const port = process.env.PORT ? process.env.PORT:5000 ;
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin,X-Requested-With, Content-Type, Accept, Authorization"
        );
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
        next();
});

// app.use(express.static('public'));
app.use(express.json());
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(errorHandler);

app.get("/api/validateToken", validateToken,CheckToken)

app.get("/api/search/:search", searchdb)

app.get("/api/searchUser/:id", paginatedSearch(User, "fullname", se),searchUsers)

app.get("/api/searchPost/:id", paginatedSearch(Post,"content",content),searchUsers)

app.use("/api/users", require("./routes/userRoute"))

app.use("/api/posts",require("./routes/postsRoute"));

app.use("/api/comments/", require("./routes/commentRoute"));


app.listen(port, ()=>{
    console.log(`server listening to port ${port}`)
})