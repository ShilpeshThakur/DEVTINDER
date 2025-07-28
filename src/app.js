const express = require("express")

const app = express();

app.use("/route", [rh1,rh2],rh3,rh4)

app.use("/user",
    (req,res,next)=>{
        // route handler
        console.log("handling the route 1")
        next()
    },
    (req,res,next)=>{
         // route handler
        console.log("handling the route 2")
        // res.send("2nd response")
        next()
    },
    (req,res,next)=>{
         // route handler
        console.log("handling the route 3")
        // res.send("3rd response")
        next()
    },
    (req,res,next)=>{
         // route handler
        console.log("handling the route 4")
        // res.send("4th response")
        next()
    }
)

app.use((req,res)=>{
    res.send("response 5")
})

app.listen(7777,()=>{
    console.log("Server is listening on port 7777...")
})



