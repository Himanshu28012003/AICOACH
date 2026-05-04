import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import User from "../models/user.model.js"


const sendAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body

        if (!name || !email || !password) {
            return res.status(400).json({message: "name, email and password are required"})
        }

        let user = await User.findOne({email})
        if(!user){
            const hashedPassword = await bcrypt.hash(password, 10)
            user = await User.create({
                name,
                email,
                password: hashedPassword
            })
        } else {
            return res.status(400).json({message: "user already exists"})
        }

        let token = await genToken(user.id)
        sendAuthCookie(res, token)

        const safeUser = await User.findByIdExclude(user.id, ["password"])
        return res.status(201).json(safeUser)



    } catch (error) {
        return res.status(500).json({message:`Registration error ${error}`})
    }
    
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({message: "email and password are required"})
        }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({message: "invalid credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({message: "invalid credentials"})
        }

        const token = await genToken(user.id)
        sendAuthCookie(res, token)

        const safeUser = await User.findByIdExclude(user.id, ["password"])
        return res.status(200).json(safeUser)

    } catch (error) {
        return res.status(500).json({message:`Login error ${error}`})
    }
    
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        })
        return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
         return res.status(500).json({message:`Logout error ${error}`})
    }
    
}