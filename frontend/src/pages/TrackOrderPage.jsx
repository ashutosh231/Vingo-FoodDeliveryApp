import axios from 'axios'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useEffect } from 'react'
import { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
function TrackOrderPage() {
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState() 
    const navigate = useNavigate()
    const {socket}=useSelector(state=>state.user)
    const [liveLocations,setLiveLocations]=useState({})
    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
socket.on('updateDeliveryLocation',({deliveryBoyId,latitude,longitude})=>{
setLiveLocations(prev=>({
  ...prev,
  [deliveryBoyId]:{lat:latitude,lon:longitude}
}))
})
    },[socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])
    return (
        <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6 min-h-screen bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2]'>
            <motion.div
                className='relative flex items-center gap-4 mb-4 cursor-pointer'
                onClick={() => navigate("/")}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                <h1 className='text-2xl font-bold md:text-center text-gray-800'>Track Order</h1>
            </motion.div>
      {currentOrder?.shopOrders?.map((shopOrder,index)=>(
        <motion.div
            className='bg-white/95 backdrop-blur p-5 rounded-2xl shadow-xl border-2 border-orange-100 space-y-4'
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
         <div>
            <p className='text-xl font-bold mb-3 text-[#ff4d2d]'>{shopOrder.shop.name}</p>
            <p className='font-semibold text-gray-700 mb-1'><span className='text-gray-500'>Items:</span> {shopOrder.shopOrderItems?.map(i=>i.name).join(", ")}</p>
            <p className='font-semibold text-gray-700 mb-1'><span className='text-gray-500'>Subtotal:</span> ₹{shopOrder.subtotal}</p>
            <p className='mt-4 font-semibold text-gray-700'><span className='text-gray-500'>Delivery address:</span> {currentOrder.deliveryAddress?.text}</p>
         </div>
         {shopOrder.status!="delivered"?(
          <>
            {shopOrder.assignedDeliveryBoy ? (
              <motion.div
                className='text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className='font-semibold mb-1'><span className='text-gray-600'>Delivery Boy Name:</span> {shopOrder.assignedDeliveryBoy.fullName}</p>
                <p className='font-semibold'><span className='text-gray-600'>Delivery Boy contact No.:</span> {shopOrder.assignedDeliveryBoy.mobile}</p>
              </motion.div>
            ) : (
              <p className='font-semibold text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200'>Delivery Boy is not assigned yet.</p>
            )}
          </>
         ) : (
           <motion.p
             className='text-green-600 font-bold text-xl bg-green-50 p-3 rounded-lg border border-green-200 text-center'
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: 'spring', stiffness: 200 }}
           >
             ✓ Delivered
           </motion.p>
         )}

{(shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered") && (
  <motion.div
    className="h-[400px] w-full rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: 0.3 }}
  >
    <DeliveryBoyTracking data={{
      deliveryBoyLocation:liveLocations[shopOrder.assignedDeliveryBoy._id] || {
        lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
        lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
      },
      customerLocation: {
        lat: currentOrder.deliveryAddress.latitude,
        lon: currentOrder.deliveryAddress.longitude
      }
    }} />
  </motion.div>
)}



        </motion.div>
      ))}



        </div>
    )
}

export default TrackOrderPage
