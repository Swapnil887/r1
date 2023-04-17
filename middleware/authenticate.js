require("dotenv").config()
const cookieParser =  require("cookie-parser")
const jwt = require("jsonwebtoken")
const { Usermodel } = require("../model/user")
const { Blacklistmodel } = require("../model/blacklistmodel")

const authenticate = async(req,res,next)=>{
   const token = req.cookies.token
   console.log(token)

   const blacklist = await Blacklistmodel.find({token})
   
   if(blacklist.length!=0)
   {
    return res.send("You have to login first")
   }
    try {
        jwt.verify(token,process.env.token_key,async (err,result)=>{
            if(err)
            {
                res.send({error:err.message});
            }else{
                const {email} = result;
                data = await Usermodel.find({email})
                req.body.name = data[0].name;
                req.body.email = email
                req.body.role = data[0].role
                next()
            }
        })
    } catch (error) {
        console.log("error")
        res.send("something went wrong while authenticate")
    }
}

module.exports = {authenticate}