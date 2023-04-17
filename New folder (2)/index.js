const express  = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { connection } = require("./config/db");
const { userInfo } = require("os");
const { userRoute } = require("./controller/user");
const { blogs } = require("./controller/blogs");
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("hello")
})

app.use("/user",userRoute)
app.use("/blog",blogs)

app.listen(process.env.port,async ()=>{
    await connection
    console.log("server is running")
})