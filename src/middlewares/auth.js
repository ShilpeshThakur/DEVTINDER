const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async(req,res,next)=>{
    try{
        //read the token form request cookie
        const {token} = req.cookies
        if(!token){
            throw new Error("token is not valid")
        }
        //validate token
        const decodedData = await jwt.verify(token,"SECRETE_KEY_DEV@Tinder$790")

        const {_id} = decodedData;

        const user = await User.findById(_id)

        if(!user){
            throw new Error("User not found.")
        }
        req.user = user;
        next()
    }catch(err){
        res.status(400).send("Error : "+err.message)
    }
    

}

module.exports = { userAuth }