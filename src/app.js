const express = require("express")

const app = express();

app.get("/user",(req,res)=>{
    res.send({
        username:"Shilpesh",
        lastname:"Thakur"
    })
})

app.post("/user",(req,res)=>{
    console.log("User saved to database")
    res.send("data successfully saved to database")
})

app.delete("/user",(req,res)=>{
    console.log("User deleted to database")
    res.send("data successfully deleted from database")
})

app.use("/test",(req,res)=>{
    res.send("Namaste dashboard");
})

app.listen(7777,()=>{
    console.log("Server is listening on port 7777")
})



