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
const allowedOrigins = [
    "http://localhost:5173",
    "https://aicoach-lh1z.onrender.com"
]

app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (e.g., curl, mobile clients)
        if (!origin) return callback(null, true)
        // allow localhost (any port) for development
        if (origin.startsWith("http://localhost")) return callback(null, true)
        // allow specific allowed origins
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true)
        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
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
