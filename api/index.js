import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import cors from "cors"
import uploadRoute from "./routes/upload.js"

dotenv.config()

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())

// app.get("/",(req,res)=>{
//     res.send("Hello world")
// })
app.use("/api/auth",authRoute)
app.use("/api/upload", uploadRoute)



const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to mongo db");
        
    } catch (error) {
        console.log(error);
        
    }
}
connect()

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;