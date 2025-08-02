const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateProfileEditData,validatePassword} = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try {
        const user = req.user;

        res.send(user)
    }catch(err){
        res.status(500).send("Error : "+err.message)
    }
   
});

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Data is invalid")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key])

        await loggedInUser.save()

        res.json({
            message: `${loggedInUser.firstName} your profile updated successfully`,
            data: loggedInUser
        });
    }catch(err){
        res.status(400).send("Error : "+err.message)
    }

})

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    try{
        if(! await validatePassword(req)){
            throw new Error("Data is invalid")
        }
        const user = req.user;

        const passwordHash = await bcrypt.hash(req.body.newPassword, 10)
        user.password = passwordHash;

        await user.save()
        res.send("Password updated successfully.")
    }catch(err){
        res.status(400).send("Error : "+err.message)
    }
})

module.exports = {profileRouter}
