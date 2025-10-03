import { compareSync, genSaltSync, hashSync } from "bcrypt";
import users from "../models/users.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { generateToken, sendEmailOtp } from "../utils/token.js";
import nodemailer from "nodemailer";
import pkg from "jsonwebtoken";
import { v4 as uuidv4} from "uuid";

const { verify } = pkg;

export const signup = async (req, res) => {
  console.log("signup controller");
  console.log(req.body);

  try {
    let { firstName, lastName, userName, email, password, cPassword } =
      req.body;

    email = email?.toLowerCase();
    userName = userName?.toLowerCase();

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !password ||
      !cPassword
    ) {
      return res
        .status(400)
        .json(sendError({ status: false, message: "All field are required" }));
    }

    const existingUserByEmail = await users.findOne({ email: email });
    const existingUserByUsername = await users.findOne({ userName: userName });
    const salt = genSaltSync(10);
    let doc;
    console.log(existingUserByUsername);

    if (existingUserByEmail) {
      return res
        .status(400)
        .json(sendError({ status: false, message: "User already register" }));
    }
    if (existingUserByUsername) {
      return res
        .status(400)
        .json(sendError({ status: false, message: "Username already exists" }));
    }

    if (password.length <= 7) {
      return res.status(400).json(
        sendError({
          status: false,
          message: "Password must be at least 8 characters",
        })
      );
    }

    if (password !== cPassword) {
      return res
        .status(400)
        .json(sendError({ status: false, message: "Password do not match" }));
    }
    if (password?.length > 7) {
      doc = new users({
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: hashSync(password, salt),
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    console.log(otp, "otp is created");
    doc.otp = otp
    doc.expiresIn = Date.now() + 5 * 60 * 1000
    console.log(doc, "doc");

   let savedUser =  await doc.save();
    console.log(savedUser, "user save");

    if(savedUser.errors){
      return res.status(400).json(sendError({
        status:false,
        message:"Internal server error"
      }))
    }else{
      savedUser.password = undefined
      const token = generateToken({ data: savedUser, expiresIn: "24h" });
      console.log(token);

      const emailResponse = sendEmailOtp(email, otp);
      res.status(200).json(
        sendSuccess({
          status: true,
          message: "User Successfully register",
          data: savedUser,
          token,
        })
      );
    }


  } catch (error) {
    console.log(error);
  }
}; 

export const verifyEmail = async (req, res) => {
  console.log(req.body, "req.body");
  
  try {
    let { otp, email } = req.body;
    otp = String(otp)
    email = email?.toLowerCase()
    if (otp && email) {
      const user = await users.findOne({ email:email , otp:otp });
      if (user) {
        console.log(user, "user");
        console.log(user.expiresIn > Date.now());
        if (user.expiresIn > Date.now()) {
          user.isVerified = true;
          user.otp = undefined;
          user.expiresIn = undefined;
          await user.save();
          return res.status(200).json(
            sendSuccess({
              status: true,
              message: "Email verification successfully",
              data: user,
            })
          );
        } else {
          return res.status(404).json(
            sendError({
              status: false,
              message: "OTP has expired. Please request a new OTP",
            })
          );
        }
      } else {
        return res.status(400).json(
          sendError({
            status: false,
            message: "Invalid OTP",
          })
        );
      }
    } else {
      return res.status(401).json(
        sendError({
          status: false,
          message: "Missing fields",
        })
      );
    }
  } catch (error) {
    return res.status(505).json(
      sendError({
        status: false,
        message: error.message,
        error,
      })
    );
  }
};

export const resendOtp = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.toLowerCase();

    if (!email) {
      return res.status(400).json(
        sendError({
          status: false,
          message: "Email is required",
        })
      );
    }

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json(
        sendError({
          status: false,
          message: "User not found",
        })
      );
    }

    if (user.isVerified) {
      return res.status(400).json(
        sendError({
          status: false,
          message: "Email is already verified",
        })
      );
    }

    // Generate new OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = otp;
    user.expiresIn = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();

    // Send OTP again
    const emailResponse = sendEmailOtp(email, otp);

    return res.status(200).json(
      sendSuccess({
        status: true,
        message: "OTP resent successfully",
        data: { email },
      })
    );
  } catch (error) {
    return res.status(500).json(
      sendError({
        status: false,
        message: error.message,
      })
    );
  }
};


export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.toLowerCase();

    if (req.cookies?.token) {
      return res.status(400).json(
        sendError({
          status: false,
          message: "User already logged in",
        })
      );
    }

    if (email && password) {
      let user = await users.findOne({ email });
      console.log(user);

      if (user) {
        const isValid = compareSync(password, user.password);

        if (isValid) {
          user.password = undefined;
          const token = generateToken({ data: user, expiresIn: "24h" });
          res.cookie("token", token, { httpOnly: true });
          res.status(200).json(
            sendSuccess({
              status: true,
              message: "login successfully",
              token,
              data: user,
            })
          );
        } else {
          return res.status(400).json(
            sendError({
              status: false,
              message: "Email or password is not valid",
            })
          );
        }
      } else {
        return res
          .status(400)
          .json(sendError({ status: false, message: "User not found" }));
      }
    } else {
      return res
        .status(400)
        .json(sendError({ status: false, message: "Missing fields" }));
    }
  } catch (error) {
    console.log(error);
  }
};

export const forgetPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (email) {
      const user = await users.findOne({
        email: email,
      });
      if (user) {
        const secret = user._id + process.env.JWT;
        const token = generateToken({ data: user, expiresIn: "30m" });
        console.log("token", token);

        const link = `${process.env.WEB_LINK}/api/auth/resetPassword/${user._id}/${token}`;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        const mailOption = {
          from: "ahmedzubairmemon@gmail.com",
          to: user.email,
          subject: "Reset",
          html: `<p>Click <a href="${link}">here</a> to reset your password</p>`,
        };

        transporter.sendMail(mailOption, (error, info) => {
          if (error) {
            console.log(error);
            return res.status(404).json(
              sendError({
                status: false,
                message: error.message,
              })
            );
          } else {
            console.log("email send", info.response);
            return res.status(200).json(
              sendSuccess({
                status: true,
                message: "Reset password",
              })
            );
          }
        });
      } else {
        return res.status(404).json(
          sendError({
            status: false,
            message: "User not found",
          })
        );
      }
    }
  } catch (error) {
    return res.status(505).json(
      sendError({
        status: false,
        message: error.message,
      })
    );
  }
};

export const resetPasswordEmail = async (req, res) => {
  console.log("reset password");

  try {
    const { newPassword, confirmPassword, token } = req.body;

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json(sendError({ status: false, message: "Passwords do not match" }));
    }
    if (newPassword && confirmPassword && token) {
      const result = verify(token, process.env.JWT);
      console.log("decode", result);

      const userId = result.id;
      const user = await users.findById(userId);

      if (user) {
        const salt = genSaltSync(10);
        const hashedpassword = hashSync(newPassword, salt);
        await users.findByIdAndUpdate(userId, {
          $set: { password: hashedpassword },
        });
        return res.status(200).json(
          sendSuccess({
            status: true,
            message: "Password updated successfully",
          })
        );
      } else {
        return res.status(404).json(
          sendError({
            status: false,
            message: "No user found",
          })
        );
      }
    } else {
      return res.status(400).json(
        sendError({
          status: false,
          message: "All fields are required",
        })
      );
    }
  } catch (error) {
    return res.status(505).json(
      sendError({
        status: false,
        message: error.message,
      })
    );
  } 
};