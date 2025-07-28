const adminAuth = (req,res,next)=>{
    console.log("admin auth is getting check")
    const token = "xyz";
    const isAdminAuthorised = (token === "xyz")
    console.log(isAdminAuthorised)
    if(isAdminAuthorised){
       next();
    }
    else{
        res.status(401).send("You are not authorised")
    }
}

const userAuth = (req,res,next)=>{
    console.log("user auth is getting check")
    const token = "xyz";
    const isAdminAuthorised = (token === "xyz")
    console.log(isAdminAuthorised)
    if(isAdminAuthorised){
       next();
    }
    else{
        res.status(401).send("You are not authorised")
    }
}

module.exports = { adminAuth, userAuth }