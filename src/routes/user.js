const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"
const User = require("../models/user")

//Get all pending connection request for the loggedIn user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        //.populate("fromUserId",["firstName","lastName"])

        res.send({message:"Data fetched successfully.",data:connectionRequests})
    }catch(err){
        res.status(400).send({message: "Error : "+err.message})
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {fromUserId: loggedInUser._id, status : "accepted"},
                {toUserId: loggedInUser._id, status : "accepted"}
            ]

        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)


        const data = connectionRequests.map((row)=> {
            if(loggedInUser._id.toString() === row.fromUserId._id.toString()){
                return row.toUserId
            }
            return row.fromUserId   
        })

        res.send({message:"Got the connection request",data: data})
    }catch(err){
        res.status(400).send({message: "Error : "+err.message})
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        // User should all the other user card except
        // 0. his own card
        // 1. his connections
        // 2. ignored people
        // 3. already sent the connection request 
        
        const loggedInUser = req.user

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit >= 50 ? 50 : limit;
        
        const skip = (page - 1) * limit;

        //find all connection request that i have sent or received
        const connectionRequests = await ConnectionRequest.find({
           $or : [{fromUserId : loggedInUser._id},{toUserId : loggedInUser._id}]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((user)=>{
            hideUserFromFeed.add(user.fromUserId.toString())
            hideUserFromFeed.add(user.toUserId.toString())
        })

        const user = await User.find({
            $and : [
                {_id : { $nin : Array.from(hideUserFromFeed) } },
                {_id : { $ne : loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send(user);
    }catch(err){
        res.status(400).send({message: "Error : "+err.message})
    }
})
module.exports = userRouter