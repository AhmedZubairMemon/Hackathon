import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import cors from "cors"

dotenv.config()

const app = express()

const port = process.env.PORT || 8000


app.use(cors());

app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Hello world")
})
app.use("/api/auth",authRoute)

app.listen(port,()=>{
    console.log("Server is running")
})

const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to mongo db");
        
    } catch (error) {
        console.log(error);
        
    }
}
connect()
export default app

