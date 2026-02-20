import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import { motion } from 'framer-motion'
function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)
    return (
        <div className='min-h-screen bg-linear-to-br from-[#fff3e9] via-[#fff9f6] to-[#ffe1d2] flex justify-center p-6'>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className='w-full max-w-[800px]'
            >
                <div className='flex items-center gap-[20px] mb-6 '>
                    <div className=' z-10 ' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                    </div>
                    <h1 className='"text-2xl font-bold  text-start'>Your Cart</h1>
                </div>
                {cartItems?.length == 0 ? (
                    <p className='text-gray-500 text-lg text-center'>Your Cart is Empty</p>
                ) : (<>
                    <div className='space-y-4'>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>
                    <motion.div
                        className='mt-6 glass-card p-5 rounded-xl shadow-xl flex justify-between items-center border-2 border-white/40'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className='text-lg font-bold text-gray-800'>Total Amount</h1>
                        <span className='text-2xl font-bold text-[#ff4d2d]'>₹{totalAmount}</span>
                    </motion.div>
                    <div className='mt-4 flex justify-end'>
                        <motion.button
                            className='bg-gradient-to-r from-[#ff4d2d] to-[#e64528] text-white px-8 py-3 rounded-xl text-lg font-bold shadow-xl cursor-pointer'
                            onClick={()=>navigate("/checkout")}
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,77,45,0.4)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Proceed to CheckOut
                        </motion.button>
                    </div>
                </>
                )}
            </motion.div>
        </div>
    )
}

export default CartPage
