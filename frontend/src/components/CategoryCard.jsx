import React from 'react'
import { motion } from 'framer-motion'

function CategoryCard({name,image,onClick}) {
  return (
    <motion.div
      className='w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-white/40 shrink-0 overflow-hidden glass-card relative cursor-pointer'
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.04, boxShadow: '0 20px 50px rgba(15,23,42,0.2)' }}
      whileTap={{ scale: 0.96, y: -1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
     <img src={image} alt="" className='w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110'/>
     <div className='absolute bottom-0 w-full left-0 glass-strong px-3 py-2 rounded-t-xl text-center text-sm font-bold text-gray-900 border-t border-white/40'>
        {name}
     </div>
    </motion.div>
  )
}

export default CategoryCard
