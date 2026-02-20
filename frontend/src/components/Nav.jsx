import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
function Nav() {
    const { userData, currentCity ,cartItems} = useSelector(state => state.user)
        const { myShopData} = useSelector(state => state.owner)
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [query,setQuery]=useState("")
    const [isScrolled, setIsScrolled] = useState(false)
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchItems=async () => {
      try {
        const result=await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,{withCredentials:true})
    dispatch(setSearchItems(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
        if(query){
handleSearchItems()
        }else{
              dispatch(setSearchItems(null))
        }

    },[query])

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        onScroll()
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-9999 overflow-visible glass-nav transition-all duration-300 ${
                isScrolled ? 'shadow-lg' : ''
            }`}
        >
            <AnimatePresence>
            {showSearch && userData.role == "user" && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className='w-[90%] h-[70px] glass-card shadow-xl rounded-xl items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden'
                >
                    <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-2 border-white/30'>
                        <FaLocationDot size={25} className="text-[#ff4d2d]" />
                        <div className='w-[80%] truncate text-gray-700 font-medium'>{currentCity}</div>
                    </div>
                    <div className='w-[80%] flex items-center gap-[10px]'>
                        <IoIosSearch size={25} className='text-[#ff4d2d]' />
                        <input
                            type="text"
                            placeholder='search delicious food...'
                            className='px-[10px] text-gray-700 outline-0 w-full bg-transparent placeholder:text-gray-400'
                            onChange={(e)=>setQuery(e.target.value)}
                            value={query}
                        />
                    </div>
                </motion.div>
            )}
            </AnimatePresence>



            <motion.h1
                className='text-3xl font-extrabold tracking-tight mb-2 text-[#ff4d2d]'
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
                Vingo
            </motion.h1>
            {userData.role == "user" && (
                <div className='md:w-[60%] lg:w-[40%] h-[70px] glass-card shadow-xl rounded-xl items-center gap-[20px] hidden md:flex border border-white/40'>
                    <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-2 border-white/30'>
                        <FaLocationDot size={25} className="text-[#ff4d2d]" />
                        <div className='w-[80%] truncate text-gray-700 font-medium'>{currentCity}</div>
                    </div>
                    <div className='w-[80%] flex items-center gap-[10px]'>
                        <IoIosSearch size={25} className='text-[#ff4d2d]' />
                        <input
                            type="text"
                            placeholder='search delicious food...'
                            className='px-[10px] text-gray-700 outline-0 w-full bg-transparent placeholder:text-gray-400'
                            onChange={(e)=>setQuery(e.target.value)}
                            value={query}
                        />
                    </div>
                </div>
            )}

            <div className='flex items-center gap-4'>
                {userData.role == "user" && (showSearch ? <RxCross2 size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(false)} /> : <IoIosSearch size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(true)} />)
                }
                {userData.role == "owner"? (
                    <>
                        {myShopData && (
                            <>
                                <motion.button
                                    className='hidden md:flex items-center gap-1 p-2.5 cursor-pointer rounded-full glass-card text-[#ff4d2d] font-medium border border-white/30'
                                    onClick={()=>navigate("/add-item")}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaPlus size={20} />
                                    <span>Add Food Item</span>
                                </motion.button>
                                <motion.button
                                    className='md:hidden flex items-center p-2.5 cursor-pointer rounded-full glass-card text-[#ff4d2d] border border-white/30'
                                    onClick={()=>navigate("/add-item")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaPlus size={20} />
                                </motion.button>
                            </>
                        )}
                       
                        <motion.div
                            className='hidden md:flex items-center gap-2 cursor-pointer relative px-4 py-2 rounded-xl glass-card text-[#ff4d2d] font-medium border border-white/30'
                            onClick={()=>navigate("/my-orders")}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <TbReceipt2 size={20}/>
                            <span>My Orders</span>
                        </motion.div>
                        <motion.div
                            className='md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-2 rounded-xl glass-card text-[#ff4d2d] font-medium border border-white/30'
                            onClick={()=>navigate("/my-orders")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <TbReceipt2 size={20}/>
                        </motion.div>
                    </>
                ) : (
                    <>
                        {userData.role=="user" && (
                            <motion.div
                                className='relative cursor-pointer'
                                onClick={()=>navigate("/cart")}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiShoppingCart size={25} className='text-[#ff4d2d]' />
                                <motion.span
                                    className='absolute right-[-9px] top-[-12px] text-[#ff4d2d] font-bold bg-white/90 backdrop-blur rounded-full w-5 h-5 flex items-center justify-center text-xs border border-white/30'
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {cartItems.length}
                                </motion.span>
                            </motion.div>
                        )}
                        <motion.button
                            className='hidden md:block px-4 py-2 rounded-xl glass-card text-[#ff4d2d] text-sm font-medium border border-white/30'
                            onClick={()=>navigate("/my-orders")}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            My Orders
                        </motion.button>
                    </>
                )}



                <motion.div
                    className='w-[40px] h-[40px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#ff4d2d] to-[#e64528] text-white text-[18px] shadow-xl font-semibold cursor-pointer border-2 border-white/30'
                    onClick={() => setShowInfo(prev => !prev)}
                    whileHover={{ scale: 1.1, boxShadow: '0 8px 20px rgba(255,77,45,0.4)' }}
                    whileTap={{ scale: 0.92 }}
                >
                    {userData?.fullName.slice(0, 1)}
                </motion.div>
                <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={`fixed top-[80px] right-[10px] 
                            ${userData.role=="deliveryBoy"?"md:right-[20%] lg:right-[40%]":"md:right-[10%] lg:right-[25%]"} w-[190px] glass-strong shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-9999 border border-white/40`}
                    >
                        <div className='text-[17px] font-semibold text-gray-800'>{userData.fullName}</div>
                        {userData.role=="user" && (
                            <div
                                className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer hover:text-[#e64323] transition-colors'
                                onClick={()=>navigate("/my-orders")}
                            >
                                My Orders
                            </div>
                        )}
                        <div
                            className='text-[#ff4d2d] font-semibold cursor-pointer hover:text-[#e64323] transition-colors'
                            onClick={handleLogOut}
                        >
                            Log Out
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>

            </div>
        </motion.header>
    )
}


export default Nav
