import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import initDb from "./config/initDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"

const app = express()
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests from localhost on any port (for development)
        if (!origin || origin.startsWith("http://localhost")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)

const PORT = process.env.PORT || 6000
app.listen(PORT , async ()=>{
    console.log(`Server running on port ${PORT}`)
    await connectDb()
    await initDb()
})
