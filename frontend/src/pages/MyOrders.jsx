import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { setMyOrders, updateOrderStatus, updateRealtimeOrderStatus } from '../redux/userSlice';
import { motion } from 'framer-motion';


function MyOrders() {
  const { userData, myOrders,socket} = useSelector(state => state.user)
  const navigate = useNavigate()
const dispatch=useDispatch()
  useEffect(()=>{
socket?.on('newOrder',(data)=>{
if(data.shopOrders?.owner._id==userData._id){
dispatch(setMyOrders([data,...myOrders]))
}
})

socket?.on('update-status',({orderId,shopId,status,userId})=>{
if(userId==userData._id){
  dispatch(updateRealtimeOrderStatus({orderId,shopId,status}))
}
})

return ()=>{
  socket?.off('newOrder')
  socket?.off('update-status')
}
  },[socket])



  
  return (
    <div className='w-full min-h-screen bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2] flex justify-center px-4'>
      <motion.div
        className='w-full max-w-[800px] p-4'
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className='flex items-center gap-[20px] mb-6'>
          <motion.div
            className='z-10 cursor-pointer'
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
          </motion.div>
          <h1 className='text-3xl font-bold text-gray-800'>My Orders</h1>
        </div>
        <div className='space-y-6'>
          {myOrders?.length > 0 ? (
            myOrders.map((order,index)=>(
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {userData.role=="user" ? (
                  <UserOrderCard data={order} />
                ) : userData.role=="owner" ? (
                  <OwnerOrderCard data={order} />
                ) : null}
              </motion.div>
            ))
          ) : (
            <motion.div
              className='text-center py-12'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className='text-gray-500 text-lg'>No orders yet</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default MyOrders
