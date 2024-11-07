import React from "react";

const StyledButton = ({ onClick, icon, buttonText}) => {
    return (
        <button 
            className="bg-light-purple text-white font-bold py-3 px-10 text-md rounded-md flex items-center justify-center gap-3 hover:bg-light-purple/80 active:bg-clicked-purple transition duration-300 ease-in-out mb-2 w-full"
            onClick={onClick}
        >
            {icon}
            {buttonText}
        </button>
    )
}

export default StyledButton;

