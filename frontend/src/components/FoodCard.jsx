import React, { useState } from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import { motion } from 'framer-motion';

function FoodCard({data}) {
const [quantity,setQuantity]=useState(0)
const dispatch=useDispatch()
const {cartItems}=useSelector(state=>state.user)
    const renderStars=(rating)=>{   //r=3
        const stars=[];
        for (let i = 1; i <= 5; i++) {
           stars.push(
            (i<=rating)?(
                <FaStar className='text-yellow-500 text-lg'/>
            ):(
                <FaRegStar className='text-yellow-500 text-lg'/>
            )
           )
            
        }
return stars
    }

const handleIncrease=()=>{
    const newQty=quantity+1
    setQuantity(newQty)
}
const handleDecrease=()=>{
    if(quantity>0){
const newQty=quantity-1
    setQuantity(newQty)
    }
    
}

  return (
    <motion.div
      className='w-[250px] rounded-2xl border-2 border-white/40 glass-card overflow-hidden flex flex-col'
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 25px 60px rgba(15,23,42,0.25)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className='relative w-full h-[170px] flex justify-center items-center overflow-hidden'>
        <motion.div
          className='absolute top-3 right-3 glass-strong rounded-full p-1.5 shadow-lg z-10 border border-white/40'
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {data.foodType=="veg"?<FaLeaf className='text-green-600 text-lg'/>:<FaDrumstickBite className='text-red-600 text-lg'/>}
        </motion.div>

        <motion.img
          src={data.image}
          alt=""
          className='w-full h-full object-cover'
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col p-4 bg-white/50 backdrop-blur">
        <h1 className='font-bold text-gray-900 text-base truncate mb-1'>{data.name}</h1>

        <div className='flex items-center gap-1 mt-1'>
          {renderStars(data.rating?.average || 0)}
          <span className='text-xs text-gray-600 font-medium'>
            ({data.rating?.count || 0})
          </span>
        </div>
      </div>

      <div className='flex items-center justify-between mt-auto p-3 bg-white/60 backdrop-blur border-t border-white/30'>
        <span className='font-bold text-gray-900 text-xl'>
          ₹{data.price}
        </span>

        <div className='flex items-center glass-strong rounded-full overflow-hidden shadow-md border border-white/40'>
          <motion.button
            className='px-2.5 py-1.5 hover:bg-white/50 transition'
            onClick={handleDecrease}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaMinus size={12}/>
          </motion.button>
          <span className='px-2 font-bold min-w-[24px] text-center text-gray-800'>{quantity}</span>
          <motion.button
            className='px-2.5 py-1.5 hover:bg-white/50 transition'
            onClick={handleIncrease}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPlus size={12}/>
          </motion.button>
          <motion.button
            className={`${cartItems.some(i=>i.id==data._id)?"bg-gray-800":"bg-gradient-to-r from-[#ff4d2d] to-[#e64528]"} text-white px-3 py-2 transition-colors shadow-lg`}
            onClick={()=>{
              quantity>0?dispatch(addToCart({
                id:data._id,
                name:data.name,
                price:data.price,
                image:data.image,
                shop:data.shop,
                quantity,
                foodType:data.foodType
              })):null
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaShoppingCart size={16}/>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default FoodCard
