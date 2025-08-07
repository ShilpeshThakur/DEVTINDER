const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const validator = require('validator');
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minlength : 4,
        maxlength : 40,
    } ,
    lastName:{
        type:String,
        minlength : 4,
        maxlength : 40
    },
    emailId:{
        type:String,
        required:true,
        unique: true,
        lowercase : true,
        trim: true,
        validate(value) {
            if( !validator.isEmail(value)){
                throw new Error(`Invalid email address: ${value}`)
            }
        }
    },
    password:{
        type:String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password: "+value)
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum : {
            values:["male","female","others"],
            message: `{VALUE} is not valid gender type`
        },
        // validate(value){
        //     if(!["male","female","others"].includes(value)){
        //         throw new Error("Gender data is not validb ")
        //     }
        // }
    },
    photoUrl:{
        type: String,
        default:"https://avatars.githubusercontent.com/u/30509968?v=4",
        validate: {
            validator: function (value) {
            return validator.isURL(value);
            },
            message: props => `Invalid URL: ${props.value}`
        }
    },
    about:{
        type:String,
        default:"This is a default about of the user"
    },
    skills:{
        type: [{
            type:String,
            minlength: 4,
            maxlength: 20
        }]
        // ,
        // validate:[
        //     {
        //         validator: function(arr){
        //             return arr.length >= 1
        //         },
        //         message: "At least 1 skill is required",
        //     },
        //     {
        //         validator: function (arr) {
        //             return arr.length <= 5;
        //         },
        //         message: "No more than 5 skills allowed",
        //     }
        // ]
    }
},
    {
        timestamps: true 
}) 

userSchema.methods.getJwt = async function(){
    const user = this
    const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{ expiresIn: '1d' })

    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser, 
        passwordHash)

    return isPasswordValid
}
module.exports = mongoose.model("User", userSchema)