const express = require("express")
const authRouter = express.Router();
const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {validateSignUpdata} = require("../utils/validation");


authRouter.post('/signup', async(req,res)=>{

    try{
        //validation of data
        validateSignUpdata(req);

        const {firstName, lastName, emailId, password} = req.body
        //Encrypt the password

        const passwordHash = await bcrypt.hash(password, 10)

        //store the user into database


        //creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })

        const savedUser = await user.save();
        const token = await savedUser.getJwt()

        res.cookie("token",token,{expires: new Date(Date.now() + 8 * 3600000)});
        res.json({message:"User Added Successfully.",data:savedUser})
    }catch(err){
        res.status(500).send("Error : "+err.message)
    }
})

authRouter.post('/login',async(req,res)=>{
    try{

        const {emailId, password} = req.body;

        // sanitise emailId
        if(!validator.isEmail(emailId)){
            throw new Error("Email is incorrect.")
        }

        const user = await User.findOne({emailId:emailId})

        if(!user){
            throw new Error("User is invalid.")
        }
        const isPasswordValid = await user.validatePassword(password)

        if(isPasswordValid){
            const token = await user.getJwt()

            res.cookie("token",token,{expires: new Date(Date.now() + 8 * 3600000)});
            res.send(user);
        }else{
            throw new Error("Invalid credential.")
        }

    }catch(err){
        res.status(500).send("Error : "+err.message)
    }
})

authRouter.post('/logout',async(req,res)=>{
    // do cleanup session,cache,etc
     res.cookie("token",null,{
        expires : new Date(Date.now())
     }).send("Log Out Successfull.");
})

module.exports = {authRouter};