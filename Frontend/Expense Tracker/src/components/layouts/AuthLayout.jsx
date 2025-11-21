import React from 'react';
import CARD_2 from "../../assets/images/Card-2.png";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className='flex'>
      <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
        {/* Logo Section - FIXED */}
        <div className='flex items-center gap-3 mb-8'>
          <div className='w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center'>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
          <h2 className='text-xl font-bold text-gray-800'>ExpenseTracker</h2>
        </div>
        
        {children}
      </div>
      
      <div className='hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>
        <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5'/>
        <div className='w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10'/>
        <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5'/>

        <div className='grid grid-cols-1 z-20'>
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="430,000"
            color="bg-primary"
          />
        </div>

        <img
          src={CARD_2}
          className='w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15'
          alt="Credit Card"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className='flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-20'>
      <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        {icon}
      </div>
      <div>
        <h6 className='text-xs text-gray-500 mb-1'>{label}</h6>
        <span className='text-[20px]'>${value}</span>
      </div>
    </div>
  );
};