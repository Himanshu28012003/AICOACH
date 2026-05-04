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

const defaultAllowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://aicoach-lh1z.onrender.com"
]

const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])]

const localhostOriginPattern = /^http:\/\/localhost:\d+$/

const corsOptions = {
    origin: (origin, callback) => {
        // Allow tools/non-browser requests that do not send Origin.
        if (!origin) return callback(null, true)

        if (allowedOrigins.includes(origin) || localhostOriginPattern.test(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions))

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
