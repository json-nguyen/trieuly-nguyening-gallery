import React from "react";

const JBLoader = () =>  {
  return (
    <div className="mt-8 relative flex items-center align-center justify-center w-24 h-24">
     <div className="absolute w-full h-full border-4 border-gray-300 border-t-clicked-purple rounded-full animate-spin"></div>   
     <img
       src="assets/JB_Wedding_logo.png"
       alt="Wedding Logo"
       className="max-w-[4rem] sm:max-w-[4rem]"
     />
   </div>
  )
}

export default JBLoader