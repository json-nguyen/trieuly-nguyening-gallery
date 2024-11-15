import { useState } from 'react'
import { ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';
import StyledButton from '../components/shared/StyledButton';
import { useNavigate } from 'react-router-dom';

const LandingPage= () => {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div>
        <img src="assets/JB_Wedding_logo.png" alt="Wedding Logo" className="max-w-[6rem] sm:max-w-[8rem] md:max-w-[10rem]" />
      </div> 
      <div className="border-2 border-black p-2">
        <img src="assets/Beverly_Jason_Engagement.jpg" alt="Jason+Bev" className="w-full max-w-xs sm:max-w-md md:max-w-lg" />
      </div>
      <div className='mt-4'>
        <StyledButton 
          icon={<ArrowUpTrayIcon className="h-6 w-6"/>}
          onClick={() => navigate("/gallery")}
          buttonText={"Upload Images + Videos"}
          />
        <StyledButton
          icon={<PhotoIcon className="h-6 w-6" />}
          onClick={() => navigate("/gallery")}
          buttonText={"View Gallery"}
        />
      </div>
      <div className="mt-4">
        <img src="assets/jason_bev_name.png" alt="Jason+Bev" className="w-full max-w-xs sm:max-w-md md:max-w-lg" />
      </div>
      <div className="mt-3 px-6 text-center font-quincy text-gray-700">
        <p className="text-lg sm:text-xl md:text-2xl leading-relaxed">
          We are thrilled to celebrate our special day with you! Thank you for being part of our journey.
          Feel free to capture memories, upload photos, and enjoy the gallery. Here’s to a day full of love, laughter, and memories!
        </p>
      </div>
      
    </div>
  )
}

export default LandingPage
