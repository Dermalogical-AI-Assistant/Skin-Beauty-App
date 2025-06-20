import React from "react";
import { Link } from "react-router-dom";

interface BrandLogoProps {
  position?: "center" | "straight" | "top" | "icon";
}

const BrandLogo: React.FC<BrandLogoProps> = (props) => {
    switch (props.position) {
      case "center":
        return (
          <Link
            className={`relative h-full select-none flex flex-col items-center justify-center `}
            to="/"
          >
            <div className={`h-full`}>
              <img
                src={`https://res.cloudinary.com/dk6ivhi6t/image/upload/v1749754496/uploads/TDCosmetic/wexgjhieiv3d6lbk9frs.png`}
                alt="Brand Logo"
                className="hover:scale-110 h-full transition-all duration-300 object-cover drop-shadow-2xl"
              />
            </div>
          </Link>
        );
        break;
      case "straight":
        return (
          <Link
            className={`relative select-none flex flex-col items-center justify-center out-line-orange-100 out-line-4`}
            to="/"
          >
            <div>
              <img
                src={`https://res.cloudinary.com/dk6ivhi6t/image/upload/v1749752550/uploads/TDCosmetic/vcqb7l1irwhky9geykpp.png`}
                alt="Brand Logo"
                className="h-35 hover:scale-110 transition-all duration-300 object-cover drop-shadow-2xl"
              />
            </div>
          </Link>
        );
      case "icon":
        return (
          <Link
            className={`relative select-none flex flex-col items-center justify-center out-line-orange-100 out-line-4`}
            to="/"
          >
            <div>
              <img
                src={`https://res.cloudinary.com/dk6ivhi6t/image/upload/v1749752553/uploads/TDCosmetic/rbbo7gqjtgyxl5niftdg.svg`}
                alt="Brand Logo"
                className="h-35 hover:scale-110 transition-all duration-300 object-cover drop-shadow-2xl"
              />
            </div>
          </Link>
        );
      default:
        return (
          <Link
            className={`relative select-none flex flex-col items-center justify-center out-line-orange-100 out-line-4 h-full`}
            to="/"
          >
            <div className={`h-full`}>
              <img
                src={`https://res.cloudinary.com/dk6ivhi6t/image/upload/v1749757641/uploads/TDCosmetic/lbbslazweo6fzuihagpo.png`}
                alt="Brand Logo"
                className="h-full hover:scale-110 transition-all duration-300 object-cover drop-shadow-2xl"
              />
            </div>
          </Link>
        );
    }
};

export default BrandLogo;