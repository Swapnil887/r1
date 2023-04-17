const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema({
    "blog":String,
    "email":String
})

const Blogmodel = mongoose.model("blogs",blogsSchema)


module.exports = {Blogmodel}