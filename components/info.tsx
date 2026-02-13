import React from 'react'

const content = [
    {
        title: "Unregulated Antimicrobial Usage (AMU)",
        description: "Excessive and unmonitored use of antimicrobials in livestock accelerates antimicrobial resistance (AMR), reducing the effectiveness of life-saving drugs in both animals and humans. This creates resistant pathogens that can transfer through food chains and environmental pathways."
    },
    {
        title: "MRL Violations and Food Safety Risks",
        description: "Failure to comply with Maximum Residue Limits (MRLs) for antimicrobials in milk and meat can lead to contaminated food products entering the market, posing significant health risks to consumers and damaging public trust in food safety."
    },
    {
        title: "Lack of Predictive Tools for Residue Risks",
        description: "Farmers and producers currently lack access to predictive tools that can assess the risk of antimicrobial residues in their products, making it difficult to take proactive measures to prevent MRL violations and ensure food safety."
    }
]


const info = () => {
  return (
    <div className='py-20'>
        <div className='w-300 mx-auto'>
            <h2 className='text-3xl mb-12 text-center font-bold text-[#2F243A]'>Key Challenges in Livestock Antimicrobial <br /> Management</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {content.map((item, index) => (
                    <div key={index} className='bg-[#ede4e4] p-6 rounded-xl hover:bg-[#edddd7] shadow-md transform transition duration-300 hover:scale-105'>
                        <h3 className='text-xl font-bold text-[#d96d4f] mb-4'>{item.title}</h3>
                        <p className='text-[#444054] text-justify'>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default info