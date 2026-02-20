import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';
import { motion } from 'framer-motion';
function CartItemCard({data}) {
    const dispatch=useDispatch()
    const handleIncrease=(id,currentQty)=>{
       dispatch(updateQuantity({id,quantity:currentQty+1}))
    }
      const handleDecrease=(id,currentQty)=>{
        if(currentQty>1){
  dispatch(updateQuantity({id,quantity:currentQty-1}))
        }
        
    }
  return (
    <motion.div
      className='flex items-center justify-between glass-card p-4 rounded-xl shadow-xl border border-white/40'
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ y: -2, boxShadow: '0 15px 35px rgba(15,23,42,0.15)' }}
      transition={{ duration: 0.2 }}
    >
      <div className='flex items-center gap-4'>
        <motion.img
          src={data.image}
          alt=""
          className='w-20 h-20 object-cover rounded-xl border-2 border-white/40 glass-strong'
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <div>
            <h1 className='font-bold text-gray-800'>{data.name}</h1>
            <p className='text-sm text-gray-600'>₹{data.price} x {data.quantity}</p>
            <p className="font-bold text-gray-900 text-lg">₹{data.price*data.quantity}</p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <motion.button
          className='p-2 cursor-pointer glass-strong rounded-full border border-white/30'
          onClick={()=>handleDecrease(data.id,data.quantity)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaMinus size={12} className='text-gray-700'/>
        </motion.button>
        <span className='font-bold min-w-[20px] text-center text-gray-800'>{data.quantity}</span>
        <motion.button
          className='p-2 cursor-pointer glass-strong rounded-full border border-white/30'
          onClick={()=>handleIncrease(data.id,data.quantity)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaPlus size={12} className='text-gray-700'/>
        </motion.button>
        <motion.button
          className="p-2 glass-strong rounded-full border border-red-200/50 text-red-600"
          onClick={()=>dispatch(removeCartItem(data.id))}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <CiTrash size={18}/>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CartItemCard
