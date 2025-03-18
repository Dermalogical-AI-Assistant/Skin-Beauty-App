import React from "react";



const BrandLogo: React.FC = () => {
    return (
        <div className={`select-none flex flex-col items-center justify-center text-[#F2907E] out-line-orange-100 out-line-4`}>
            {/* brand logo */}
            <h1 className={`py-3 font-bold text-2xl font-sunflower drop-shadow-lg `}>
                Skin Beauty
            </h1>
        </div>
    );
};

export default BrandLogo;