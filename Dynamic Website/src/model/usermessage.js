const mongoose= require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
    name:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
        validator(value){
            if(!validator.isEmail(value)){
               throw new Error("Invalid email id.") 
            }
        }
    },
    phone:{
        type : Number,
        required : true,
    },
    message:{
        type : String,
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;