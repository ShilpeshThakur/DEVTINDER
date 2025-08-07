const express = require("express")
const requestRouter = express.Router()

const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")
const sendEmail = require("../utils/sendEmail")

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        const allowedStatus = ["ignored","interested"];

        if(!allowedStatus.includes(status)){
            return res
            .status(400)
            .json({message:"invalid status type"});
        }

        const toUser = await User.findById(toUserId)

        if(!toUser){
            return res.status(404).json({
                message:"User not found"
            })   
        }

        // If there is an existing connection request
        const  existingconnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId:fromUserId}
                ] 
        })


        if(existingconnectionRequest){
            return res
            .status(400)
            .send({message:"Request is Already sent"});
        }

        const ConnectionRequestData  = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await ConnectionRequestData.save();

        const emailRes = await sendEmail.run("A new friend request from "+req.user.firstName,
            req.user.firstName+ " is " + status + " in "+ toUser.firstName
        );

        res.json({
            message: req.user.firstName+ " is " + status + " in "+ toUser.firstName,
            data: data})
    }catch(err){
        res.status(400).send("Error : "+ err.message)
    }

});

requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    const loggedInUser = req.user

    const {status,requestId} = req.params

    const allowedStatus = ["accepted","rejected"];

    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"invalid request"})
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id : requestId,
        toUserId: loggedInUser._id,
        status : "interested"
    })

    if(!connectionRequest){
        return res
        .status(400)
        .json({message:"connection request not found"})
    }

    connectionRequest.status = status

    const data = await connectionRequest.save()

    res.send({message:"connection request is "+status, data})

})

module.exports = requestRouter