const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { Usermodel } = require("../model/user");
const { Blogmodel } = require("../model/blogs");
const { authenticate } = require("../middleware/authenticate");
const { authorise } = require("../middleware/authorise");
const userRoute = express.Router()
require("dotenv").config()


const blogs = express.Router()

blogs.get("/",authenticate,authorise(["user"]),async (req,res)=>{
    try {
       const data =  await Blogmodel.find()
       res.send(data)
    } catch (error) {
        console.log(error)
        res.send("something went wrong in blog get")
    }
})


blogs.post("/",authenticate,authorise(["user"]),async(req,res)=>{
    const {blog,email} = req.body;
    try {
        const Data = Blogmodel({blog,email})
        const data = await Data.save()
        res.send(data)
    } catch (error) {
        console.log(error)
        res.send("something went wrong in posting blogs")
    }
})


blogs.patch("/",authenticate,authorise(["user"]),async(req,res)=>{
    const {email,blog,_id} = req.body
    try {
        const data = await Blogmodel.find({_id});
        if(email===data[0].email)
        {
            const Data = await Blogmodel.updateOne({_id},{blog:blog})
            res.send(Data)
        }else{
            res.send("You can not update others blogs")
        }
    } catch (error) {
        console.log(error)
        res.send("something went wrong while user update blogs")
    }
})

blogs.delete("/",authenticate,authorise(["user","moderator"]),async(req,res)=>{
    const {email,blog,_id,role} = req.body
    if(role=="moderator"){
        const Data = await Blogmodel.deleteOne({_id})
       return  res.send(Data)
    }
    try {
        const data = await Blogmodel.find({_id});
        console.log(data)
        if(data.length!=0){
        if(email===data[0].email)
        {
            const Data = await Blogmodel.deleteOne({_id})
            res.send(Data)
        }else{
            res.send("You can not delete others blogs")
        }}
        else{
            res.send("id invalid")
        }
    } catch (error) {
        console.log(error)
        res.send("something went wrong while user delete blogs")
    }
})

module.exports = {blogs}