const express = require("express")
const {connectDb} = require("./config/database")
const app = express();
const User = require("./models/user")

app.use(express.json())


app.post('/signup', async(req,res)=>{
    //creating a new instance of the user model
    const user = new User(req.body)

    try{
        await user.save();
        res.send("User Added Successfully.")
    }catch(err){
        res.status(500).send("Error while saving the user "+err.message)
    }
})

app.get('/user',async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const userDetail = await User.find({emailId:userEmail})
        if(userDetail.length === 0 ){
            res.status(404).send("user Not found")
        }else{
            res.send(userDetail)
        }
    }catch(err){
        res.send("something went wrong."+err.message)
    }
})

app.get("/user/:id",async(req,res)=>{
    try{
        console.log(id)
        const userDetail = await User.findById(id)
        if(userDetail){
            res.send(userDetail)
        }else{
            res.send("something went wrong")
        }
    }catch(err){
        res.status(500).send("Somethoing went wrong."+err.message)
    }
})

// feed api - GET/ feed - get all the users from database
app.get('/feed',async(req,res)=>{
    try{
        const userDetail = await User.find({})
        if(userDetail.length === 0 ){
            res.status(404).send("user Not found")
        }else{
            res.send(userDetail)
        }
    }catch(err){
        res.send("something went wrong",err.message)
    }
})

app.delete("/user",async(req,res)=>{
    const userId = req.body.id
    try{
        const user = await User.findByIdAndDelete( {_id : userId })
        // const user = await User.findByIdAndDelete(userId)

        // console.log(user);
        res.send("user is deleted successfully")
    }catch(err){
        res.send("something went wrong"+err.message)
    }
})

//update delete of user

app.patch('/user/:userId',async(req,res)=>{
    const userId = req.params.userId;
    const data = req.body;
    
    try{
        const ALLOWED_UPDATES = [
            "photoUrl","about","gender","age","skills"
        ]

        const isUpdateAllowed = Object.keys(data).every(k =>{
            return ALLOWED_UPDATES.includes(k)
        })

        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }
        const userDetail = await User.findByIdAndUpdate(userId,
            data,
            {
                returnDocument: "after",
                runValidators: true
            }
        )
        // console.log(userDetail)
        res.send("user is updated successfully")
    }catch(err){
        res.send("something went wrong"+err.message)
    }
})

connectDb().then(()=>{
    console.log("Database connection established.")
    app.listen(7777,()=>{
        console.log("Server is listening on port 7777...")
    })
}).catch((err)=>{
    console.error("Database cannot be connected")
})




