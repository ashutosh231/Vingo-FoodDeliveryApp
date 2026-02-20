import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { motion } from 'framer-motion'
function SignUp() {
    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate=useNavigate()
    const [fullName,setFullName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [mobile,setMobile]=useState("")
    const [err,setErr]=useState("")
    const [loading,setLoading]=useState(false)
    const dispatch=useDispatch()
     const handleSignUp=async () => {
        setLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/auth/signup`,{
                fullName,email,password,mobile,role
            },{withCredentials:true})
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message)
             setLoading(false)
        }
     }

     const handleGoogleAuth=async () => {
        if(!mobile){
          return setErr("mobile no is required")
        }
        const provider=new GoogleAuthProvider()
        const result=await signInWithPopup(auth,provider)
  try {
    const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
        fullName:result.user.displayName,
        email:result.user.email,
        role,
        mobile
    },{withCredentials:true})
   dispatch(setUserData(data))
  } catch (error) {
    console.log(error)
  }
     }
    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2]'>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className='glass-strong rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/40'
            >
                <h1 className={`text-3xl font-bold mb-2 `} style={{ color: primaryColor }}>Vingo</h1>
                <p className='text-gray-600 mb-8'> Create your account to get started with delicious food deliveries
                </p>

                {/* fullName */}

                <div className='mb-4'>
                    <label htmlFor="fullName" className='block text-gray-700 font-semibold mb-2'>Full Name</label>
                    <input
                        type="text"
                        className='w-full glass border-2 border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d]/50 transition-all'
                        placeholder='Enter your Full Name'
                        onChange={(e)=>setFullName(e.target.value)}
                        value={fullName}
                        required
                    />
                </div>
                {/* email */}

                <div className='mb-4'>
                    <label htmlFor="email" className='block text-gray-700 font-semibold mb-2'>Email</label>
                    <input
                        type="email"
                        className='w-full glass border-2 border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d]/50 transition-all'
                        placeholder='Enter your Email'
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </div>
                {/* mobile*/}

                <div className='mb-4'>
                    <label htmlFor="mobile" className='block text-gray-700 font-semibold mb-2'>Mobile</label>
                    <input
                        type="tel"
                        className='w-full glass border-2 border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d]/50 transition-all'
                        placeholder='Enter your Mobile Number'
                        onChange={(e)=>setMobile(e.target.value)}
                        value={mobile}
                        required
                    />
                </div>
                {/* password*/}

                <div className='mb-4'>
                    <label htmlFor="password" className='block text-gray-700 font-semibold mb-2'>Password</label>
                    <div className='relative'>
                        <input
                            type={`${showPassword ? "text" : "password"}`}
                            className='w-full glass border-2 border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d]/50 pr-12 transition-all'
                            placeholder='Enter your password'
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <button
                            className='absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors'
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>
                </div>
                {/* role*/}

                <div className='mb-4'>
                    <label htmlFor="role" className='block text-gray-700 font-semibold mb-2'>Role</label>
                    <div className='flex gap-2'>
                        {["user", "owner", "deliveryBoy"].map((r) => (
                            <motion.button
                                key={r}
                                className={`flex-1 glass-card border-2 rounded-xl px-3 py-2.5 text-center font-semibold transition-all cursor-pointer ${
                                    role==r
                                    ? 'bg-gradient-to-r from-[#ff4d2d] to-[#e64528] text-white border-[#ff4d2d] shadow-lg'
                                    : 'border-white/30 text-[#ff4d2d] hover:border-[#ff4d2d]/50'
                                }`}
                                onClick={()=>setRole(r)}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {r}
                            </motion.button>
                        ))}
                    </div>
                </div>

            <motion.button
                className='w-full font-bold py-3 rounded-xl transition duration-200 bg-gradient-to-r from-[#ff4d2d] to-[#e64528] text-white shadow-xl cursor-pointer'
                onClick={handleSignUp}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 10px 30px rgba(255,77,45,0.4)' }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
            >
                {loading?<ClipLoader size={20} color='white'/>:"Sign Up"}
            </motion.button>
            {err && <motion.p className='text-red-500 text-center my-[10px] font-medium' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>*{err}</motion.p>}
            

            <motion.button
                className='w-full mt-4 flex items-center justify-center gap-2 glass-card border-2 border-white/40 rounded-xl px-4 py-3 transition cursor-pointer font-semibold'
                onClick={handleGoogleAuth}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
            >
                <FcGoogle size={20}/>
                <span>Sign up with Google</span>
            </motion.button>
            <p className='text-center mt-6 cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account ?  <span className='text-[#ff4d2d]'>Sign In</span></p>
            </motion.div>
        </div>
    )
}

export default SignUp
