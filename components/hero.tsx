import React from 'react'

const hero = () => {
  return (
    <div className='w-300 mx-auto py-20 flex items-center flex-col md:flex-row gap-12 justify-between'>
        <div className='w-lg content-center'>
            <h1 className='text-4xl font-bold text-[#2F243A]'>Monitor Antimicrobial Usage. Ensure MRL Compliance. Protect Food Safety.</h1>
            <p className='mt-4 text-[#444054] text-justify'>A digital livestock monitoring platform that tracks antimicrobial usage, predicts residue risks, and prevents Maximum Residue Limit (MRL) violations in milk and meat production.</p>
            <div className='flex items-center gap-6'>
            <button className='mt-6 bg-[#d96d4f] text-white px-6 py-3 cursor-pointer rounded-full'>Get Started</button>
            <button className='mt-6 bg-[#d96d4f] text-white px-6 py-3 cursor-pointer rounded-full'>Learn More</button>
            </div>
        </div>
        <div className='w-80 h-80 bg-gray-400 rounded-3xl'>

        </div>
    </div>
  )
}

export default hero