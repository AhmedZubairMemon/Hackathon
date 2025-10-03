import dotenv from "dotenv"
import pkg from "jsonwebtoken"
import nodemailer from "nodemailer"

const {sign, verify} = pkg

dotenv.config()

export const generateToken = ({data, expiresIn = "24h"})=>{

    return sign(
        {id:data._id, email:data.email},
        process.env.JWT,
        {expiresIn}
    )
}

const emailConfig = {
    service : "gmail",
    auth: {
        user: process.env.Email,
        pass: process.env.PASSWORD

    }
}

export const sendEmailOtp = async (mail, otp) =>{
    const transporter = nodemailer.createTransport(emailConfig)

    const mailOption = {
        from:process.env.EMAIL,
        to:mail,
        subject:"OTP verification",
        text:`Your otp is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOption);
        return `OTP send to ${mail} via emial`;
    } catch (error) {
        throw `Error sending OTP to ${mail} via email:${error}`
    }
}