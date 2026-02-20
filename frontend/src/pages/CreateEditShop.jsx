import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
function CreateEditShop() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.owner)
    const { currentCity,currentState,currentAddress } = useSelector(state => state.user)
    const [name,setName]=useState(myShopData?.name || "")
     const [address,setAddress]=useState(myShopData?.address || currentAddress)
     const [city,setCity]=useState(myShopData?.city || currentCity)
       const [state,setState]=useState(myShopData?.state || currentState)
       const [frontendImage,setFrontendImage]=useState(myShopData?.image || null)
       const [backendImage,setBackendImage]=useState(null)
       const [loading,setLoading]=useState(false)
       const dispatch=useDispatch()
       const handleImage=(e)=>{
        const file=e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
       }

       const handleSubmit=async (e)=>{
        e.preventDefault()
        setLoading(true)
        try {
           const formData=new FormData()
           formData.append("name",name) 
           formData.append("city",city) 
           formData.append("state",state) 
           formData.append("address",address) 
           if(backendImage){
            formData.append("image",backendImage)
           }
           const result=await axios.post(`${serverUrl}/api/shop/create-edit`,formData,{withCredentials:true})
           dispatch(setMyShopData(result.data))
          setLoading(false)
          navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
       }
    return (
        <div className='flex justify-center flex-col items-center p-6 bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2] relative min-h-screen'>
            <motion.div
                className='absolute top-[20px] left-[20px] z-10 mb-[10px] cursor-pointer'
                onClick={() => navigate("/")}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </motion.div>

            <motion.div
                className='max-w-lg w-full bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-8 border border-orange-100'
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
            >
                <motion.div
                    className='flex flex-col items-center mb-6'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <motion.div
                        className='bg-orange-100 p-4 rounded-full mb-4'
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                        <FaUtensils className='text-[#ff4d2d] w-16 h-16' />
                    </motion.div>
                    <div className="text-3xl font-extrabold text-gray-900">
                        {myShopData ? "Edit Shop" : "Add Shop"}
                    </div>
                </motion.div>
                <form className='space-y-5' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                        <input type="text" placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                        onChange={(e)=>setName(e.target.value)}
                        value={name}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>shop Image</label>
                        <input type="file" accept='image/*' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={handleImage}  />
                        {frontendImage &&   <div className='mt-4'>
                            <img src={frontendImage} alt="" className='w-full h-48 object-cover rounded-lg border'/>
                        </div>}
                      
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                           <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                        <input type="text" placeholder='City' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e)=>setCity(e.target.value)}
                        value={city}/> 
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
                        <input type="text" placeholder='State' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e)=>setState(e.target.value)}
                        value={state}/> 
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                        <input type="text" placeholder='Enter Shop Address' className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e)=>setAddress(e.target.value)}
                        value={address}/> 
                    </div>
                    <motion.button
                        className='w-full bg-[#ff4d2d] text-white px-6 py-4 rounded-lg font-semibold shadow-lg'
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? '' : '0 10px 25px rgba(255,77,45,0.4)' }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                        {loading?<ClipLoader size={20} color='white'/>:"Save"}
                    </motion.button>
                </form>
            </motion.div>
                
                

        </div>
    )
}

export default CreateEditShop
