import React from 'react'
import Nav from './NaV.JSX'
import { useSelector } from 'react-redux'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import OwnerItemCard from './ownerItemCard';
import { motion } from 'framer-motion';
function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  
  return (
    <motion.div
      className='w-full min-h-screen bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2] flex flex-col items-center'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Nav />
      {!myShopData && (
        <motion.div
          className='flex justify-center items-center p-4 sm:p-6'
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.div
            className='w-full max-w-md bg-white/95 backdrop-blur shadow-xl rounded-2xl p-8 border border-orange-100'
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(15,23,42,0.15)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className='flex flex-col items-center text-center'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
              </motion.div>
              <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Restaurant</h2>
              <p className='text-gray-600 mb-6 text-sm sm:text-base'>Join our food delivery platform and reach thousands of hungry customers every day.
              </p>
              <motion.button
                className='bg-[#ff4d2d] text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg'
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(255,77,45,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {myShopData && (
        <motion.div
          className='w-full flex flex-col items-center gap-6 px-4 sm:px-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.h1
            className='text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center font-bold'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <FaUtensils className='text-[#ff4d2d] w-14 h-14' />
            Welcome to {myShopData.name}
          </motion.h1>

          <motion.div
            className='bg-white/95 backdrop-blur shadow-xl rounded-2xl overflow-hidden border border-orange-100 w-full max-w-3xl relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ y: -4, boxShadow: '0 25px 50px rgba(15,23,42,0.15)' }}
          >
            <motion.div
              className='absolute top-4 right-4 bg-[#ff4d2d] text-white p-3 rounded-full shadow-lg z-10 cursor-pointer'
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={()=>navigate("/create-edit-shop")}
            >
              <FaPen size={20}/>
            </motion.div>
            <img src={myShopData.image} alt={myShopData.name} className='w-full h-48 sm:h-64 object-cover'/>
            <div className='p-4 sm:p-6'>
              <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>{myShopData.name}</h1>
              <p className='text-gray-500 '>{myShopData.city},{myShopData.state}</p>
              <p className='text-gray-500 mb-4'>{myShopData.address}</p>
            </div>
          </motion.div>

          {myShopData.items.length==0 && (
            <motion.div
              className='flex justify-center items-center p-4 sm:p-6'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <motion.div
                className='w-full max-w-md bg-white/95 backdrop-blur shadow-xl rounded-2xl p-8 border border-orange-100'
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(15,23,42,0.15)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className='flex flex-col items-center text-center'>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
                  >
                    <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
                  </motion.div>
                  <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Food Item</h2>
                  <p className='text-gray-600 mb-6 text-sm sm:text-base'>Share your delicious creations with our customers by adding them to the menu.
                  </p>
                  <motion.button
                    className='bg-[#ff4d2d] text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg'
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(255,77,45,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/add-item")}
                  >
                    Add Food
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

            {myShopData.items.length>0 && (
              <motion.div
                className='flex flex-col items-center gap-4 w-full max-w-3xl'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                {myShopData.items.map((item,index)=>(
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <OwnerItemCard data={item} />
                  </motion.div>
                ))}
              </motion.div>
            )}
        </motion.div>
      )}



    </motion.div>
  )
}

export default OwnerDashboard
