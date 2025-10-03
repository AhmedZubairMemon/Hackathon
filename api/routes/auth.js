import express from "express"
import  {signup, login, forgetPasswordEmail, verifyEmail, resetPasswordEmail, resendOtp} from "../controllers/auth.js"

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/verifyemail",verifyEmail)
router.post("/resendOtp",resendOtp)
router.post("/forgetPassword",forgetPasswordEmail)
router.post("/resetPassword",resetPasswordEmail)

export default router