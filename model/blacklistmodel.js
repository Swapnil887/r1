const mongoose = require("mongoose")


const blacklistSchema=  new mongoose.Schema({
    "token":String
})

const Blacklistmodel = mongoose.model("blacklist",blacklistSchema)


module.exports = {Blacklistmodel}