const express = require("express")
const requestRouter = express.Router()

const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post("/request/sent/:status/:toUserId",userAuth,async(req,res)=>{
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
        res.json({
            message: req.user.firstName+ " is " + status + " in "+ toUser.firstName,
            data: data})
    }catch(err){
        res.status(400).send("Error : "+ err.message)
    }

});


module.exports = requestRouter