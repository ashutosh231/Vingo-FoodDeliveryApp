import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { motion } from 'framer-motion'

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({})//itemId:rating

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })

    }

    const handleRating = async (itemId, rating) => {
        try {
            const result = await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({
                ...prev, [itemId]: rating
            }))
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <motion.div
            className='bg-white/95 backdrop-blur rounded-xl shadow-xl p-5 space-y-4 border border-gray-100'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(15,23,42,0.15)' }}
            transition={{ duration: 0.3 }}
        >
            <div className='flex justify-between border-b-2 border-gray-200 pb-3'>
                <div>
                    <p className='font-bold text-gray-800 text-lg'>
                        Order #{data._id.slice(-6)}
                    </p>
                    <p className='text-sm text-gray-500 mt-1'>
                        Date: {formatDate(data.createdAt)}
                    </p>
                </div>
                <div className='text-right'>
                    {data.paymentMethod == "cod" ? (
                        <p className='text-sm text-gray-600 font-semibold bg-green-100 px-2 py-1 rounded'>{data.paymentMethod?.toUpperCase()}</p>
                    ) : (
                        <p className='text-sm text-gray-600 font-semibold bg-blue-100 px-2 py-1 rounded'>Payment: {data.payment ? "Paid" : "Pending"}</p>
                    )}

                    <p className='font-semibold text-blue-600 mt-2 text-lg'>{data.shopOrders?.[0].status}</p>
                </div>
            </div>

            {data.shopOrders.map((shopOrder, index) => (
                <motion.div
                    className='border-2 border-gray-200 rounded-xl p-4 bg-gradient-to-br from-orange-50/50 to-white space-y-3'
                    key={index}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <p className='font-bold text-lg text-gray-800'>{shopOrder.shop.name}</p>

                    <div className='flex space-x-4 overflow-x-auto pb-2'>
                        {shopOrder.shopOrderItems.map((item, itemIndex) => (
                            <motion.div
                                key={itemIndex}
                                className='flex-shrink-0 w-40 border-2 border-gray-200 rounded-lg p-2 bg-white shadow-md'
                                whileHover={{ scale: 1.05, y: -4 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded mb-2' />
                                <p className='text-sm font-semibold mt-1 text-gray-800'>{item.name}</p>
                                <p className='text-xs text-gray-600'>Qty: {item.quantity} x ₹{item.price}</p>

                                {shopOrder.status == "delivered" && (
                                    <div className='flex space-x-1 mt-2'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={star}
                                                className={`text-lg ${selectedRating[item.item._id] >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                                                onClick={() => handleRating(item.item._id,star)}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                ★
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                    <div className='flex justify-between items-center border-t-2 border-gray-200 pt-3'>
                        <p className='font-bold text-gray-800'>Subtotal: ₹{shopOrder.subtotal}</p>
                        <span className='text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>{shopOrder.status}</span>
                    </div>
                </motion.div>
            ))}

            <div className='flex justify-between items-center border-t-2 border-gray-200 pt-4'>
                <p className='font-bold text-xl text-gray-800'>Total: ₹{data.totalAmount}</p>
                <motion.button
                    className='bg-[#ff4d2d] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg'
                    onClick={() => navigate(`/track-order/${data._id}`)}
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(255,77,45,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Track Order
                </motion.button>
            </div>



        </motion.div>
    )
}

export default UserOrderCard
