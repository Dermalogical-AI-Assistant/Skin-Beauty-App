import React from 'react';

interface BackgroundWrapperProps {
    children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
    return (
        <div className="relative w-screen h-dvh ">
            {/*back ground*/}
            <div className={`relative bg-[#FCF9F1] z-[-1] flex flex-col justify-between h-dvh w-screen overflow-hidden`}>
                <div className={`relative blur-sm top-0 -z-1`}>
                    <div className={`absolute w-72 h-72 rounded-full -left-1/7 -top-20 bg-red-200 circle-gradient`}></div>
                </div>
                <div className={`relative flex flex-row-reverse blur-sm top-0`}>
                    <div className={`absolute w-72 h-72 rounded-full -right-1/7 -bottom-0 bg-red-200 circle-gradient`}></div>
                </div>
            </div>
            <div className={`absolute top-0 flex justify-center w-full h-dvh overflow-x-hidden overflow-y-scroll`}>
                    {children}
            </div>
        </div>
    );
};

export default BackgroundWrapper;
