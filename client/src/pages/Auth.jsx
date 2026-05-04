import React from 'react'
import { useState } from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi2";
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [mode, setMode] = useState("login")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (event) => {
        const {name, value} = event.target
        setFormData((current) => ({
            ...current,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")
        setLoading(true)

        try {
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"
            const payload = mode === "login"
                ? {email: formData.email, password: formData.password}
                : formData

            const result = await axios.post(ServerUrl + endpoint, payload, {withCredentials:true})
            dispatch(setUserData(result.data))

            if (!isModel) {
                navigate("/")
            }
        } catch (authError) {
            const message = authError?.response?.data?.message || "Authentication failed"
            setError(message)
            dispatch(setUserData(null))
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}
    `}>
                <div 
        className={`
        w-full 
        ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-4xl"}
        bg-white shadow-2xl border border-gray-200
      `}>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <BsRobot size={18}/>
                </div>
                <h2 className='font-semibold text-lg'>InterviewIQ.AI</h2>
            </div>

            <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
                {mode === "login" ? "Welcome back" : "Create your account"}
                <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2 ml-2'>
                    <IoSparkles size={16}/>
                    JWT Auth
                </span>
            </h1>

            <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
                {mode === "login"
                    ? "Sign in to continue your interviews, history, and performance insights."
                    : "Create a simple email and password account to start practicing right away."}
            </p>

            <div className='flex items-center gap-2 bg-gray-100 rounded-full p-1 mb-6'>
                <button
                    type='button'
                    onClick={() => setMode("login")}
                    className={`flex-1 rounded-full py-2 text-sm font-medium transition ${mode === "login" ? "bg-black text-white" : "text-gray-600"}`}>
                    Login
                </button>
                <button
                    type='button'
                    onClick={() => setMode("register")}
                    className={`flex-1 rounded-full py-2 text-sm font-medium transition ${mode === "register" ? "bg-black text-white" : "text-gray-600"}`}>
                    Register
                </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
                {mode === "register" && (
                    <div className='relative'>
                        <HiOutlineUser className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                        <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            placeholder='Full name'
                            className='w-full border border-gray-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-black'
                        />
                    </div>
                )}

                <div className='relative'>
                    <HiOutlineEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email address'
                        className='w-full border border-gray-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-black'
                    />
                </div>

                <div className='relative'>
                    <HiOutlineLockClosed className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='Password'
                        className='w-full border border-gray-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-black'
                    />
                </div>

                {error && (
                    <div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3'>
                        {error}
                    </div>
                )}

                <button 
                    type='submit'
                    disabled={loading}
                    className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md disabled:opacity-70'>
                    {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
                </button>
            </form>
        </div>

      
    </div>
  )
}

export default Auth
