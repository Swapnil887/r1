const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { Usermodel } = require("../model/user");
const { Blacklistmodel } = require("../model/blacklistmodel");
const userRoute = express.Router()
require("dotenv").config()

userRoute.post("/register",async(req,res)=>{
    const {name,email,password,role} = req.body

    if(!email || !password || !name){
        return res.send("please fill name,email and password")
    }

    try {
        bcrypt.hash(password,5,async (err,result)=>{
            if(err){
                return res.send(err)
            }else{
                const obj = {name,email,password:result,role}
                const data = Usermodel(obj)
                const Data = await data.save()
                res.send(Data)
            }
        })
        
    } catch (error) {
        console.log(error)
        res.send("something went wrong in register")
    }
})

userRoute.get("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        const data = await Usermodel.find({email})
        if(data.length==0)
        {
            return res.send("You have to register first");
        }
        else{
            bcrypt.compare(password,data[0].password,(err,result)=>{
                if(err)
                {
                    return res.send(err)
                }else{
                    if(!result)
                    {
                        return res.send("wrong credentials!");
                    }else{
                       const token =  jwt.sign({email},process.env.token_key,{expiresIn:60})
                       const rf_token =  jwt.sign({email},process.env.rf_token_key,{expiresIn:200})

                       res.cookie("token",token)
                       res.cookie("rf_token",rf_token)
                       console.log(req.cookies.token,req.cookies.rf_token)
                       res.send({token,rf_token})
                    }
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.send("something went wrong while login");
    }
})


userRoute.get("/getnewtoken",async(req,res)=>{
    const rf_token = req.cookies.rf_token;
    try {
        jwt.verify(rf_token,process.env.rf_token_key,(err,result)=>{
            if(err){
                res.send({error:err.message})
            }else{
                const {email} = result;
                const token = jwt.sign({email},process.env.token_key,{expiresIn:60})
                res.cookie("token",token)
                res.send({token})
            }
        })
    } catch (error) {
        console.log(error)
        res.send("error on get new token");
    }
})


userRoute.get("/logout",async(req,res)=>{
    const token = req.cookies.token;
    try {
        const data =  Blacklistmodel({token})
        const Data = await data.save()
        res.send(Data)
    } catch (error) {
        console.log(error)
        res.send("something went wrong in logout")
    }
})

module.exports = {userRoute}