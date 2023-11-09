const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
        required: true
        }
    }]
});

//generating tokens
userSchema.methods.generateAuthToken = async function(){
try{
const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
this.tokens =  this.tokens.concat({token})
await this.save();
return token;

}catch(error){
    res.send(error);
    console.log(error);
}
};

//converting password into hash
userSchema.pre("save", async function(next){

    if(this.isModified("password")){
  
   this.password = await bcrypt.hash(this.password, 10);

   this.cpassword = await bcrypt.hash(this.password, 10);
}
   next();
});

//collection
const register = mongoose.model('Register', userSchema);

module.exports = register;
