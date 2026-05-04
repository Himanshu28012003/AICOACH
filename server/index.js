import express from "express"
import path from "path"
import { fileURLToPath } from "url"
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

const corsOptions = {
    origin: (origin, callback) => {
        // Allow tools/non-browser requests that do not send Origin.
        if (!origin) return callback(null, true)

        if (allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

app.use((req, res, next) => {
    const origin = req.headers.origin

    if (origin && allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin)
        res.header("Vary", "Origin")
    }

    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")

    if (req.method === "OPTIONS") {
        return res.sendStatus(204)
    }

    next()
})

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)

// Root endpoint for quick verification (useful on Render)
app.get("/", (req, res) => {
    res.status(200).send("InterviewIQ API is running.")
})

// Health check endpoint for deploy platform probes
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
})

// Support HEAD checks
app.head("/health", (req, res) => res.sendStatus(200))

const PORT = process.env.PORT || 6000
// Serve client in production if present
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (process.env.NODE_ENV === "production") {
    const clientDist = path.join(__dirname, "..", "client", "dist")
    app.use(express.static(clientDist))

    // SPA fallback
    app.get("/*", (req, res) => {
        res.sendFile(path.join(clientDist, "index.html"), (err) => {
            if (err) {
                res.status(500).send("Error loading client")
            }
        })
    })
}

app.listen(PORT , async ()=>{
    console.log(`Server running on port ${PORT}`)
    await connectDb()
    await initDb()
})
