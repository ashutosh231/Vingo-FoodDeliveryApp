import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { useEffect } from 'react'
import { useState } from 'react'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { motion } from 'framer-motion'

function DeliveryBoy() {
  const {userData,socket}=useSelector(state=>state.user)
  const [currentOrder,setCurrentOrder]=useState()
  const [showOtpBox,setShowOtpBox]=useState(false)
  const [availableAssignments,setAvailableAssignments]=useState(null)
  const [otp,setOtp]=useState("")
  const [todayDeliveries,setTodayDeliveries]=useState([])
const [deliveryBoyLocation,setDeliveryBoyLocation]=useState(null)
const [loading,setLoading]=useState(false)
const [message,setMessage]=useState("")
  useEffect(()=>{
if(!socket || userData.role!=="deliveryBoy") return
let watchId
if(navigator.geolocation){
watchId=navigator.geolocation.watchPosition((position)=>{
    const latitude=position.coords.latitude
    const longitude=position.coords.longitude
    setDeliveryBoyLocation({lat:latitude,lon:longitude})
    socket.emit('updateLocation',{
      latitude,
      longitude,
      userId:userData._id
    })
  }),
  (error)=>{
    console.log(error)
  },
  {
    enableHighAccuracy:true
  }
}

return ()=>{
  if(watchId)navigator.geolocation.clearWatch(watchId)
}

  },[socket,userData])


const ratePerDelivery=50
const totalEarning=todayDeliveries.reduce((sum,d)=>sum + d.count*ratePerDelivery,0)



  const getAssignments=async () => {
    try {
      const result=await axios.get(`${serverUrl}/api/order/get-assignments`,{withCredentials:true})
      
      setAvailableAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentOrder=async () => {
     try {
      const result=await axios.get(`${serverUrl}/api/order/get-current-order`,{withCredentials:true})
    setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }


  const acceptOrder=async (assignmentId) => {
    try {
      const result=await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`,{withCredentials:true})
    console.log(result.data)
    await getCurrentOrder()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    socket.on('newAssignment',(data)=>{
      setAvailableAssignments(prev=>([...prev,data]))
    })
    return ()=>{
      socket.off('newAssignment')
    }
  },[socket])
  
  const sendOtp=async () => {
    setLoading(true)
    try {
      const result=await axios.post(`${serverUrl}/api/order/send-delivery-otp`,{
        orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id
      },{withCredentials:true})
      setLoading(false)
       setShowOtpBox(true)
    console.log(result.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
   const verifyOtp=async () => {
    setMessage("")
    try {
      const result=await axios.post(`${serverUrl}/api/order/verify-delivery-otp`,{
        orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id,otp
      },{withCredentials:true})
    console.log(result.data)
    setMessage(result.data.message)
    location.reload()
    } catch (error) {
      console.log(error)
    }
  }


   const handleTodayDeliveries=async () => {
    
    try {
      const result=await axios.get(`${serverUrl}/api/order/get-today-deliveries`,{withCredentials:true})
    console.log(result.data)
   setTodayDeliveries(result.data)
    } catch (error) {
      console.log(error)
    }
  }
 

  useEffect(()=>{
getAssignments()
getCurrentOrder()
handleTodayDeliveries()
  },[userData])
  return (
    <motion.div
      className='w-screen min-h-screen flex flex-col gap-5 items-center bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2] overflow-y-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Nav/>
      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
    <motion.div
      className='bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 flex flex-col justify-start items-center w-[90%] border-2 border-orange-100 text-center gap-2'
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(15,23,42,0.15)' }}
    >
      <h1 className='text-2xl font-bold text-[#ff4d2d] mb-2'>Welcome, {userData.fullName}</h1>
      <p className='text-gray-700'><span className='font-semibold'>Latitude:</span> {deliveryBoyLocation?.lat?.toFixed(6)}, <span className='font-semibold'>Longitude:</span> {deliveryBoyLocation?.lon?.toFixed(6)}</p>
    </motion.div>

<motion.div
  className='bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 w-[90%] mb-6 border-2 border-orange-100'
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.2 }}
>
  <h1 className='text-xl font-bold mb-4 text-[#ff4d2d]'>Today Deliveries</h1>

  <ResponsiveContainer width="100%" height={200}>
   <BarChart data={todayDeliveries}>
  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
  <XAxis dataKey="hour" tickFormatter={(h)=>`${h}:00`} stroke="#6b7280"/>
    <YAxis allowDecimals={false} stroke="#6b7280"/>
    <Tooltip formatter={(value)=>[value,"orders"]} labelFormatter={label=>`${label}:00`} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}/>
      <Bar dataKey="count" fill='#ff4d2d' radius={[8, 8, 0, 0]}/>
   </BarChart>
  </ResponsiveContainer>

  <motion.div
    className='max-w-sm mx-auto mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg text-center border-2 border-green-200'
    initial={{ scale: 0.95 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <h1 className='text-xl font-semibold text-gray-800 mb-2'>Today's Earning</h1>
    <span className='text-4xl font-bold text-green-600'>₹{totalEarning}</span>
  </motion.div>
</motion.div>


{!currentOrder && (
  <motion.div
    className='bg-white/95 backdrop-blur rounded-2xl p-5 shadow-xl w-[90%] border-2 border-orange-100'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
  >
    <h1 className='text-xl font-bold mb-4 flex items-center gap-2 text-[#ff4d2d]'>Available Orders</h1>

    <div className='space-y-4'>
      {availableAssignments?.length>0 ? (
        availableAssignments.map((a,index)=>(
          <motion.div
            className='border-2 border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gradient-to-r from-white to-orange-50/30 hover:shadow-lg transition-shadow'
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(15,23,42,0.1)' }}
          >
            <div>
              <p className='text-base font-bold text-gray-800 mb-1'>{a?.shopName}</p>
              <p className='text-sm text-gray-600 mb-1'><span className='font-semibold'>Delivery Address:</span> {a?.deliveryAddress.text}</p>
              <p className='text-xs text-gray-500'>{a.items.length} items | ₹{a.subtotal}</p>
            </div>
            <motion.button
              className='bg-[#ff4d2d] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg'
              onClick={()=>acceptOrder(a.assignmentId)}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(255,77,45,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Accept
            </motion.button>
          </motion.div>
        ))
      ) : (
        <motion.p
          className='text-gray-500 text-center py-8 text-lg'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No Available Orders
        </motion.p>
      )}
    </div>
  </motion.div>
)}

{currentOrder && (
  <motion.div
    className='bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl w-[90%] border-2 border-orange-100'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.4 }}
  >
    <h2 className='text-xl font-bold mb-4 text-[#ff4d2d] flex items-center gap-2'>📦 Current Order</h2>
    <motion.div
      className='border-2 border-gray-200 rounded-xl p-4 mb-4 bg-gradient-to-r from-white to-orange-50/30'
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <p className='font-bold text-base text-gray-800 mb-1'>{currentOrder?.shopOrder.shop.name}</p>
      <p className='text-sm text-gray-600 mb-1'>{currentOrder.deliveryAddress.text}</p>
      <p className='text-xs text-gray-500 font-semibold'>{currentOrder.shopOrder.shopOrderItems.length} items | ₹{currentOrder.shopOrder.subtotal}</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <DeliveryBoyTracking data={{ 
        deliveryBoyLocation:deliveryBoyLocation || {
          lat: userData.location.coordinates[1],
          lon: userData.location.coordinates[0]
        },
        customerLocation: {
          lat: currentOrder.deliveryAddress.latitude,
          lon: currentOrder.deliveryAddress.longitude
        }}} />
    </motion.div>

    {!showOtpBox ? (
      <motion.button
        className='mt-4 w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg text-lg'
        onClick={sendOtp}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? '' : '0 10px 25px rgba(34,197,94,0.4)' }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {loading?<ClipLoader size={20} color='white'/> :"Mark As Delivered"}
      </motion.button>
    ) : (
      <motion.div
        className='mt-4 p-5 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className='text-sm font-semibold mb-3 text-gray-700'>Enter OTP sent to <span className='text-[#ff4d2d] font-bold'>{currentOrder.user.fullName}</span></p>
        <input
          type="text"
          className='w-full border-2 border-gray-300 px-4 py-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] transition-all'
          placeholder='Enter OTP'
          onChange={(e)=>setOtp(e.target.value)}
          value={otp}
        />
        {message && (
          <motion.p
            className='text-center text-green-600 text-xl mb-4 font-bold'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {message}
          </motion.p>
        )}
        <motion.button
          className="w-full bg-[#ff4d2d] text-white py-3 rounded-lg font-bold shadow-lg"
          onClick={verifyOtp}
          whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(255,77,45,0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          Submit OTP
        </motion.button>
      </motion.div>
    )}
  </motion.div>
)}


      </div>
    </motion.div>
  )
}

export default DeliveryBoy
