const express = require("express")

const app = express();

const { adminAuth,userAuth }= require("./middlewares/auth")



// handle auth middleware for all request. then use() method
app.get("/getUserData",(req,res)=>{
     try{
        throw new Error("error");
        res.send("user data sent")
    }catch(err){
        res.status(500).send("error has occured")
    }
  
})

app.use("/",(err,req, res, next)=>{
    if(err){
        res.status(500).send("something went wrong")
    }
})


app.listen(7777,()=>{
    console.log("Server is listening on port 7777...")
})



