const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minlength : 4
    } ,
    lastName:{
        type:String,
        minlength : 4
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
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not validb ")
            }
        }
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
        }],
        validate:[
            {
                validator: function(arr){
                    return arr.length >= 1
                },
                message: "At least 1 skill is required",
            },
            {
                validator: function (arr) {
                    return arr.length <= 5;
                },
                message: "No more than 5 skills allowed",
            }
        ]
    }
},
    {
        timestamps: true 
}) 

const userModel = mongoose.model("User", userSchema)

module.exports = userModel;