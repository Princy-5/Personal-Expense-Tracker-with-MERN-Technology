import React, {useState} from 'react'
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi";
import SideMenu from './SideMenu';

const Navbar = ({activeMenu}) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className='flex items-center gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
      <button className='block lg:hidden text-black' onClick={() =>{
        setOpenSideMenu(!openSideMenu);
      }}
      >
        {openSideMenu ? (
          <HiOutlineX className='text-2xl'/>

        ) : (
          <HiOutlineMenu className='text-2xl'/>
        )}
      </button>
      
      {/* Logo Section - Matching the AuthLayout */}
      <div className='flex items-center gap-3'>
        <div className='w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 4L12 20 M8 8L16 8 M8 16L16 16" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <circle 
              cx="12" 
              cy="12" 
              r="9" 
              stroke="white" 
              strokeWidth="2"
            />
          </svg>
        </div>
        <h2 className='text-lg font-bold text-gray-800'>ExpenseTracker</h2>
      </div>
      
      {openSideMenu && (
        <div className='fixed top-[61px] -ml-4 bg-white'>
          <SideMenu activeMenu={activeMenu}/>
        </div>
      )}
    </div>
  )
}

export default Navbar