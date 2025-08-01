const express = require("express");
const {connectDb} = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());

const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile"); //destructing example
const requestRouter = require("./routes/request");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


connectDb().then(()=>{
    console.log("Database connection established.");
    app.listen(7777,()=>{
        console.log("Server is listening on port 7777...");
    });
}).catch((err)=>{
    console.error("Database cannot be connected");
});




