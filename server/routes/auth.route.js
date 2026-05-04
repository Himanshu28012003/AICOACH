import express from "express"
import { login, logOut, register } from "../controllers/auth.controller.js"

const authRouter = express.Router()


authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/logout",logOut)


export default authRouter