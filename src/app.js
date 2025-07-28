const express = require("express")

const app = express();

const { adminAuth,userAuth }= require("./middlewares/auth")

// handle auth middleware for all request. then use() method
app.use("/admin",adminAuth);

app.get("/admin/getAllData", (req,res)=>{
    res.send("all data sent")
})

app.get("/admin/deleteUser", (req,res)=>{
     //Logic of checking if the request is authorize
    res.send("user is deleted")
})

app.post("/user/login",(req,res)=>{
    res.send("User logged in successfully.")
})

app.get("/user",userAuth,(req,res)=>{
    res.send("User data sent.")
})

app.listen(7777,()=>{
    console.log("Server is listening on port 7777...")
})



