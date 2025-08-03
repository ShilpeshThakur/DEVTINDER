const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const { ConnectionStates } = require("mongoose")
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

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

userRouter.get("/user/requests/connection",userAuth,async(req,res)=>{
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

module.exports = userRouter