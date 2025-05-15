import React from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../../constants/routes.ts";
import { Product } from "../../types/Products.ts";
import StarRating from "../../components/StarRating";
import { BsBasket } from "react-icons/bs";

interface ProductItemProps {
  item: Product;
}

const ProductItem: React.FC<ProductItemProps> = (props) => {
  return (
      <Link
        to={`${PRODUCTS}/${props.item.id}`}
        key={`${props.item.id}`}
        className="flex-shrink-0 w-64 mx-3 transition-transform hover:scale-105 duration-300 cursor-pointer"
      >
        <div className="p-4 bg-white rounded-3xl drop-shadow-md drop-shadow-pink-light/20 hover:drop-shadow-pink-light/40 overflow-hidden h-full flex flex-col">

          {/*item image*/}
          <div className="relative h-48 overflow-hidden rounded-3xl drop-shadow-lg drop-shadow-pink-light/20 bg-white mb-2">
            <img
              src={props.item.thumbnail}
              alt={props.item.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>

          <div className="flex flex-col flex-grow">
            {/*Product title*/}
            <div className="mb-2">
              <div className={`flex justify-between font-medium text-gray-900 mb-1`}>
                <h3 className="font-semibold text-primary-dark/90 truncate">{props.item.title}</h3>
                <span className={`text-primary-dark/60 whitespace-nowrap pl-2 flex-shrink-0`}>sold {props.item.sold}</span>
              </div>
              <StarRating rating={props.item.avgRating} />
            </div>

            {/* Spacer to push price to bottom */}
            <div className="flex-grow mt-1"></div>

            {/*Price*/}
            <div className={`flex justify-between items-center mt-2`}>
              <div className={`flex items-center`}>
                <span>{props.item.currency}</span>
                <p className="text-primary-dark text-lg font-semibold">{props.item.price}</p>
              </div>
              <button className="bg-pink-light text-white py-1 px-3 rounded-full text-sm transition-colors duration-300 w-10 h-10 flex items-center justify-center">
                <BsBasket/>
              </button>
            </div>
          </div>
        </div>
      </Link>
  );
}

export default ProductItem;