const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    "name":String,
    "email":{type:String,unique:true},
    "password":String,
    "role":{type:String,enum:["moderator","user"],default:"user"}
})

const Usermodel = mongoose.model("user",userSchema)


module.exports = {Usermodel}