import React from "react";

const AlbumBox = ({ selected, handleClick, title, coverPath }) => {
  return (
    <div
      onClick={handleClick}
      className={`flex-shrink-0 w-36 h-36 sm:w-48 sm:h-48 rounded-sm overflow-hidden shadow-lg bg-white relative
                    transform transition duration-200 ease-in-out hover:scale-105 active:scale-95`}
    >
      <img
        src={coverPath}
        alt={`${title} Cover`}
        className="object-cover w-full h-full"
      />

      <div 
        className={
          `font-quincy absolute bottom-0 left-0 w-full bg-opacity-60 text-black text-center py-1 
          ${selected ? 'bg-clicked-purple' : 'bg-light-purple'}`}
      >
        {title}
      </div>
    </div>
  )
}

export default AlbumBox