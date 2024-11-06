import { useState } from 'react'
import { ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';

function LandingPage() {

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div>
        <img src="assets/JB_Wedding_logo.png" alt="Wedding Logo" className="max-w-[6rem] sm:max-w-[8rem] md:max-w-[10rem]" />
      </div> 
      <div className="border-2 border-black p-2">
        <img src="assets/Beverly_Jason_Engagement.jpg" alt="Jason+Bev" className="w-full max-w-xs sm:max-w-md md:max-w-lg" />
      </div>
      <div className='mt-4'>
        <button className="bg-light-purple text-white font-bold py-3 px-10 text-md rounded-md flex items-center justify-center gap-3 hover:bg-light-purple/80 active:bg-clicked-purple transition duration-300 ease-in-out mb-2 w-full">
          <ArrowUpTrayIcon className="h-6 w-6" />
          Upload Images + Videos
        </button>
        <button className="bg-light-purple text-white font-bold py-3 px-10 text-md rounded-md flex items-center justify-center gap-3 hover:bg-light-purple/80 active:bg-clicked-purple transition duration-300 ease-in-out w-full">
        <PhotoIcon className="h-6 w-6" />
          View Gallery
        </button>
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
