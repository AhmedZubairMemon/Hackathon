import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
     otp:{
        type:String,
        default:null
    },
    expiresIn: { type: Number }, 
    otpExpires:Date

},{timestamps:true})

export default mongoose.model("User",userSchema)