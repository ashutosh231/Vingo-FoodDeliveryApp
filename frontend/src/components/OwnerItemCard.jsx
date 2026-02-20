import axios from 'axios';
import React from 'react'
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
import { motion } from 'framer-motion';
function OwnerItemCard({data}) {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleDelete=async () => {
      try {
        const result=await axios.get(`${serverUrl}/api/item/delete/${data._id}`,{withCredentials:true})
        dispatch(setMyShopData(result.data))
      } catch (error) {
        console.log(error)
      }
    }
  return (
    <motion.div
      className='flex glass-card rounded-xl shadow-xl overflow-hidden border-2 border-white/40 w-full max-w-2xl'
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 45px rgba(15,23,42,0.2)' }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className='w-36 flex-shrink-0 overflow-hidden'
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <img src={data.image} alt="" className='w-full h-full object-cover'/>
      </motion.div>
      <div className='flex flex-col justify-between p-4 flex-1 bg-white/40 backdrop-blur'>
          <div>
            <h2 className='text-lg font-bold text-[#ff4d2d] mb-1'>{data.name}</h2>
            <p className='text-sm text-gray-700 mb-1'><span className='font-semibold text-gray-800'>Category:</span> {data.category}</p>
            <p className='text-sm text-gray-700'><span className='font-semibold text-gray-800'>Food Type:</span> {data.foodType}</p>
          </div>
          <div className='flex items-center justify-between mt-3'>
            <div className='text-[#ff4d2d] font-bold text-xl'>₹{data.price}</div>
          <div className='flex items-center gap-2'>
            <motion.div
              className='p-2 cursor-pointer rounded-full glass-strong text-[#ff4d2d] border border-white/30'
              onClick={()=>navigate(`/edit-item/${data._id}`)}
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaPen size={16}/>
            </motion.div>
            <motion.div
              className='p-2 cursor-pointer rounded-full glass-strong text-red-600 border border-red-200/50'
              onClick={handleDelete}
              whileHover={{ scale: 1.15, rotate: -15 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTrashAlt size={16}/>
            </motion.div>
          </div>

          </div>
      </div>
    </motion.div>
  )
}

export default OwnerItemCard
