require("dotenv").config()

const mongoose = require("mongoose")

const connectDb = async ()=>{
    console.log("connecting....")
    //the try catch block is for if the database fails to connect, we can just console log it and know the problem 
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database conncected", connect.connection.host,connect.connection.name);
        // console.log("\n",connect);
    } catch (err) {
        console.log(err);
        process.exit(1); 
    }   
}

module.exports = connectDb;