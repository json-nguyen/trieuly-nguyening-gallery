import React from "react";

const StyledButton = ({ onClick, icon, buttonText, disabled=false}) => {
    return (
        <button 
            disabled={disabled}
            className={
                `${disabled ? 'bg-gray-300' : 'bg-light-purple hover:bg-light-purple/80 active:bg-clicked-purple '} 
                text-white font-bold py-3 px-10 text-md rounded-md flex items-center justify-center gap-3 
                transition duration-300 ease-in-out mb-2 w-full`
            }
            onClick={onClick}
        >
            {icon}
            {buttonText}
        </button>
    )
}

export default StyledButton;

