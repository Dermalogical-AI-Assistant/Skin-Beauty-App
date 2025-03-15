import React from 'react';
import {BiLoaderAlt} from "react-icons/bi";
interface SubmitButtonProps {
    id?: string,
    isLoading?: boolean,
    children?: React.ReactNode,
    onClick?: () => void,
}

/**
 * Login page component that handles user authentication
 */
const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
    return (
        <button
            type="submit"
            // className={`bg-red-200 w-full px-3 py-4 rounded-2xl mt-3`}
            className={`flex items-center justify-center ${!props.isLoading ? "cursor-pointer bg-[#F2907E]/95 hover:drop-shadow-md" : "cursor-wait bg-[#F2907E]/60"}    b w-full font-bold text-white px-3 py-4 rounded-2xl mt-3 select-none`}
            // loading={handleLoginPassword.isLoading}
        >
            {/*Sign in*/}
            {!props.isLoading ?
                props.children :
                <BiLoaderAlt className="text-2xl animate-spin text-white"/>
            }
        </button>
    );
};

export default SubmitButton;