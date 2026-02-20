import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { addMyOrder, setTotalAmount } from '../redux/userSlice';
import { motion } from 'framer-motion';
function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null

}

function CheckOut() {
  const { location, address } = useSelector(state => state.map)
    const { cartItems ,totalAmount,userData} = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  const deliveryFee=totalAmount>500?0:40
  const AmountWithDeliveryFee=totalAmount+deliveryFee






  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }
  const getCurrentLocation = () => {
      const latitude=userData.location.coordinates[1]
      const longitude=userData.location.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)
   

  }

  const getAddressByLatLng = async (lat, lng) => {
    try {

      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
      dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
      console.log(error)
    }
  }

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlaceOrder=async () => {
    try {
      const result=await axios.post(`${serverUrl}/api/order/place-order`,{
        paymentMethod,
        deliveryAddress:{
          text:addressInput,
          latitude:location.lat,
          longitude:location.lon
        },
        totalAmount:AmountWithDeliveryFee,
        cartItems
      },{withCredentials:true})

      if(paymentMethod=="cod"){
      dispatch(addMyOrder(result.data))
      navigate("/order-placed")
      }else{
        const orderId=result.data.orderId
        const razorOrder=result.data.razorOrder
          openRazorpayWindow(orderId,razorOrder)
       }
    
    } catch (error) {
      console.log(error)
    }
  }

const openRazorpayWindow=(orderId,razorOrder)=>{

  const options={
 key:import.meta.env.VITE_RAZORPAY_KEY_ID,
 amount:razorOrder.amount,
 currency:'INR',
 name:"Vingo",
 description:"Food Delivery Website",
 order_id:razorOrder.id,
 handler:async function (response) {
  try {
    const result=await axios.post(`${serverUrl}/api/order/verify-payment`,{
      razorpay_payment_id:response.razorpay_payment_id,
      orderId
    },{withCredentials:true})
        dispatch(addMyOrder(result.data))
      navigate("/order-placed")
  } catch (error) {
    console.log(error)
  }
 }
  }

  const rzp=new window.Razorpay(options)
  rzp.open()


}


  useEffect(() => {
    setAddressInput(address)
  }, [address])
  return (
    <div className='min-h-screen bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2] flex items-center justify-center p-6'>
      <motion.div
        className='absolute top-[20px] left-[20px] z-10 cursor-pointer'
        onClick={() => navigate("/")}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </motion.div>
      <motion.div
        className='w-full max-w-[900px] glass-strong rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-white/40'
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <motion.h1
          className='text-3xl font-bold text-gray-800 mb-2'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Checkout
        </motion.h1>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className='text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800'><IoLocationSharp className='text-[#ff4d2d]' /> Delivery Location</h2>
          <div className='flex gap-2 mb-3'>
            <input
                type="text"
                className='flex-1 glass border-2 border-white/30 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 focus:border-[#ff4d2d]/50 transition-all'
                placeholder='Enter Your Delivery Address..'
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
            />
            <motion.button
              className='bg-[#ff4d2d] text-white px-4 py-3 rounded-lg flex items-center justify-center shadow-lg'
              onClick={getLatLngByAddress}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoSearchOutline size={17} />
            </motion.button>
            <motion.button
              className='bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-center shadow-lg'
              onClick={getCurrentLocation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TbCurrentLocation size={17} />
            </motion.button>
          </div>
          <motion.div
            className='rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg'
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className='h-64 w-full flex items-center justify-center'>
              <MapContainer
                className={"w-full h-full"}
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />


              </MapContainer>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className='text-lg font-semibold mb-4 text-gray-800'>Payment Method</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <motion.div
              className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left cursor-pointer ${
                paymentMethod === "cod"
                  ? "border-[#ff4d2d] bg-orange-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
              onClick={() => setPaymentMethod("cod")}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                <MdDeliveryDining className='text-green-600 text-xl' />
              </span>
              <div>
                <p className='font-semibold text-gray-800'>Cash On Delivery</p>
                <p className='text-xs text-gray-500'>Pay when your food arrives</p>
              </div>
            </motion.div>
            <motion.div
              className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left cursor-pointer ${
                paymentMethod === "online"
                  ? "border-[#ff4d2d] bg-orange-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
              onClick={() => setPaymentMethod("online")}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100'>
                <FaMobileScreenButton className='text-purple-700 text-lg' />
              </span>
              <span className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                <FaCreditCard className='text-blue-700 text-lg' />
              </span>
              <div>
                <p className='font-semibold text-gray-800'>UPI / Credit / Debit Card</p>
                <p className='text-xs text-gray-500'>Pay Securely Online</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Summary</h2>
          <motion.div
            className='rounded-xl glass-card border-2 border-white/40 p-5 space-y-2'
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {cartItems.map((item,index)=>(
              <motion.div
                key={index}
                className='flex justify-between text-sm text-gray-700'
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.6 + index * 0.05 }}
              >
                <span className='font-medium'>{item.name} x {item.quantity}</span>
                <span className='font-semibold'>₹{item.price*item.quantity}</span>
              </motion.div>
            ))}
            <hr className='border-gray-300 my-3'/>
            <div className='flex justify-between font-semibold text-gray-800'>
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className='flex justify-between text-gray-700'>
              <span>Delivery Fee</span>
              <span className={deliveryFee==0 ? 'text-green-600 font-semibold' : ''}>{deliveryFee==0?"Free":`₹${deliveryFee}`}</span>
            </div>
            <hr className='border-gray-300 my-2'/>
            <div className='flex justify-between text-xl font-bold text-[#ff4d2d] pt-2'>
              <span>Total</span>
              <span>₹{AmountWithDeliveryFee}</span>
            </div>
          </motion.div>
        </motion.section>
        <motion.button
          className='w-full bg-[#ff4d2d] text-white py-4 rounded-xl font-bold text-lg shadow-xl'
          onClick={handlePlaceOrder}
          whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(255,77,45,0.4)' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          {paymentMethod=="cod"?"Place Order":"Pay & Place Order"}
        </motion.button>

      </motion.div>
    </div>
  )
}

export default CheckOut
