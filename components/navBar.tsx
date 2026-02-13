import React from 'react'

const navBar = () => {
  return (
    <div className='w-300 mx-auto py-6'>
        <nav className='flex items-center justify-between px-6 py-4 rounded-full bg-white'>
            <h1 className='text-xl font-bold'>Agrovanta</h1>
            <ul className='flex items-center gap-8'>
                <li className='text-[#2F243A] font-semibold hover:text-[#d96d4f] cursor-pointer'>Home</li>
                <li className='text-[#2F243A] font-semibold hover:text-[#d96d4f] cursor-pointer'>About</li>
                <li className='text-[#2F243A] font-semibold hover:text-[#d96d4f] cursor-pointer'>Contacts</li>
            </ul>
            <button className='bg-[#d96d4f] text-white px-4 py-2 cursor-pointer rounded-full'>Sign In</button>
        </nav>
    </div>
  )
}

export default navBar