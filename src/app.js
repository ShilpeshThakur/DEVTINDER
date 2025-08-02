const express = require("express")
const {connectDb} = require("./config/database")
const app = express();
const User = require("./models/user")
const {validateSignUpdata} = require("./utils/validation")
const bcrypt = require("bcrypt")
const validator = require("validator")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middlewares/auth")

app.use(express.json())
app.use(cookieParser())


app.post('/signup', async(req,res)=>{

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

        await user.save();
        res.send("User Added Successfully.")
    }catch(err){
        res.status(500).send("Error : "+err.message)
    }
})

app.post('/login',async(req,res)=>{
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

            res.cookie("token",token,{expires: new Date(Date.now() + 900000)});
            res.send("login successfull.");
        }else{
            throw new Error("Invalid credential.")
        }

    }catch(err){
        res.status(500).send("Error : "+err.message)
    }
})

app.get("/profile",userAuth,async(req,res)=>{
    try {
        const user = req.user;

        res.send(user)
    }catch(err){
        res.status(500).send("Error : "+err.message)
    }
   
})

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{

    const user = req.user
    console.log("sending connection request")

    res.send(user.firstName + " sent the connection request send.")
})


connectDb().then(()=>{
    console.log("Database connection established.")
    app.listen(7777,()=>{
        console.log("Server is listening on port 7777...")
    })
}).catch((err)=>{
    console.error("Database cannot be connected")
})




