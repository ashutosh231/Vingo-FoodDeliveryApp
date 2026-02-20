import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email,setEmail]=useState("")
  const [otp,setOtp]=useState("")
  const [newPassword,setNewPassword]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const [err,setErr]=useState("")
  const navigate=useNavigate()
const [loading,setLoading]=useState(false)
  const handleSendOtp=async () => {
    setLoading(true)
    try {
      const result=await axios.post(`${serverUrl}/api/auth/send-otp`,{email},{withCredentials:true})
      console.log(result)
      setErr("")
      setStep(2)
      setLoading(false)
    } catch (error) {
       setErr(error.response.data.message)
       setLoading(false)
    }
  }
  const handleVerifyOtp=async () => {
      setLoading(true)
    try {
      const result=await axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp},{withCredentials:true})
      console.log(result)
      setErr("")
      setStep(3)
        setLoading(false)
    } catch (error) {
        setErr(error?.response?.data?.message)
          setLoading(false)
    }
  }
  const handleResetPassword=async () => {
    if(newPassword!=confirmPassword){
      return null
    }
    setLoading(true)
    try {
      const result=await axios.post(`${serverUrl}/api/auth/reset-password`,{email,newPassword},{withCredentials:true})
      setErr("")
      console.log(result)
        setLoading(false)
      navigate("/signin")
    } catch (error) {
     setErr(error?.response?.data?.message)
       setLoading(false)
    }
  }
  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2]'>
      <motion.div
        className='bg-white/95 backdrop-blur rounded-2xl shadow-2xl w-full max-w-md p-8'
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className='flex items-center gap-4 mb-6'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] cursor-pointer' onClick={()=>navigate("/signin")}/>
          </motion.div>
          <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
        </div>
        <AnimatePresence mode="wait">
        {step == 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
 <div className='mb-6'>
                    <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                    <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                </div>
                <motion.button
                    className='w-full font-semibold py-3 rounded-lg bg-[#ff4d2d] text-white shadow-lg'
                    onClick={handleSendOtp}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? '' : '0 10px 25px rgba(255,77,45,0.4)' }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading?<ClipLoader size={20} color='white'/>:"Send Otp"}
                </motion.button>
                 {err && <motion.p className='text-red-500 text-center my-[10px]' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>*{err}</motion.p>}
          </motion.div>
        )}

         {step == 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
 <div className='mb-6'>
                    <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>OTP</label>
                    <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Enter OTP' onChange={(e)=>setOtp(e.target.value)} value={otp} required/>
                </div>
                <motion.button
                    className='w-full font-semibold py-3 rounded-lg bg-[#ff4d2d] text-white shadow-lg'
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? '' : '0 10px 25px rgba(255,77,45,0.4)' }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading?<ClipLoader size={20} color='white'/>:"Verify"}
                </motion.button>
                {err && <motion.p className='text-red-500 text-center my-[10px]' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>*{err}</motion.p>}
          </motion.div>
        )}
          {step == 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
 <div className='mb-6'>
                    <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                    <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Enter New Password' onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}/>
                </div>
                <div className='mb-6'>
                    <label htmlFor="ConfirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
                    <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none  ' placeholder='Confirm Password' onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} required/>
                </div>
                <motion.button
                    className='w-full font-semibold py-3 rounded-lg bg-[#ff4d2d] text-white shadow-lg'
                    onClick={handleResetPassword}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? '' : '0 10px 25px rgba(255,77,45,0.4)' }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading?<ClipLoader size={20} color='white'/>:"Reset Password"}
                </motion.button>
                {err && <motion.p className='text-red-500 text-center my-[10px]' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>*{err}</motion.p>}
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
