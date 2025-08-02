const validator = require("validator")
const validateSignUpdata = (req) =>{
    const {firstName, lastName, emailId, password} = req.body;

    if( !firstName || !lastName) {
        throw new Error("Name is not valid")
    }else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password")
    }
}

const validateProfileEditData = (req) =>{
    const allowedEditFields = ["firstName","lastName","age","photoUrl","emailId","gender","about","skills"];
    
    const isEditAllowed = Object.keys(req.body).every((field)=> 
        allowedEditFields.includes(field)
    );

    return isEditAllowed
}

const validatePassword = async(req)=>{
    const requiredFields = ["oldPassword","newPassword"];
    const dataKeys = Object.keys(req.body)
    const hasRequiredField = requiredFields.every((field)=>
        dataKeys.includes(field)
    );

    if(!hasRequiredField){
        return false
    }

    if(!validator.isStrongPassword(req.body.newPassword)){
        return false
    }
    
    const isPasswordValid = await req.user.validatePassword(req.body.oldPassword);
    if(!isPasswordValid){
       return false
    }
    
    return true
}

module.exports = {validateSignUpdata, validateProfileEditData,validatePassword}