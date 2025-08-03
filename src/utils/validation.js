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
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new Error("Old and new passwords are required");
    }

    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Password is not strong enough");
    }
    
     if (oldPassword === newPassword) {
        throw new Error("New password must be different from old password");
    }

    const isValidOld = await req.user.validatePassword(oldPassword);
    if (!isValidOld) {
        throw new Error("Old password is incorrect");
    }
}

module.exports = {validateSignUpdata, validateProfileEditData,validatePassword}