import React from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/userDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'

function Home() {
    const {userData}=useSelector(state=>state.user)
  return (
    <motion.div
      className='w-screen min-h-screen pt-[100px] flex flex-col items-center bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2]'
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {userData.role=="user" && <UserDashboard/>}
      {userData.role=="owner" && <OwnerDashboard/>}
      {userData.role=="deliveryBoy" && <DeliveryBoy/>}
    </motion.div>
  )
}

export default Home
