import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
function OrderPlaced() {
    const navigate=useNavigate()
  return (
    <div className='min-h-screen bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <FaCircleCheck className='text-green-500 text-7xl mb-6 drop-shadow-lg'/>
      </motion.div>
      <motion.h1
        className='text-4xl font-bold text-gray-800 mb-3'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        Order Placed!
      </motion.h1>
      <motion.p
        className='text-gray-600 max-w-md mb-8 text-lg'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        Thank you for your purchase. Your order is being prepared.  
        You can track your order status in the "My Orders" section.
      </motion.p>
      <motion.button
        className='bg-gradient-to-r from-[#ff4d2d] to-[#e64528] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl'
        onClick={()=>navigate("/my-orders")}
        whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,77,45,0.4)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        Back to my orders
      </motion.button>
    </div>
  )
}

export default OrderPlaced

