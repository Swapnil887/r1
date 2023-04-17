

const authorise = (arr)=>{
    return (req,res,next)=>{
        
        if(arr.includes(req.body.role)){
            next();
        }
        else{
            res.send("you are not authorise")
        }
    }
}

module.exports = {authorise}