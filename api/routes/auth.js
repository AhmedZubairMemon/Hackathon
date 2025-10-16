import express from "express"
import  {signup, login, forgetPasswordEmail, verifyEmail, resetPasswordEmail, resendOtp, getUserDetails} from "../controllers/auth.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/verifyemail",verifyEmail)
router.post("/resendOtp",resendOtp)
router.post("/forgetPassword",forgetPasswordEmail)
router.post("/resetPassword",resetPasswordEmail)

router.get("/me",verifyToken,getUserDetails)

export default router