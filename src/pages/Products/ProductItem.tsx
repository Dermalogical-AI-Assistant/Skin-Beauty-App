import React, { useEffect, useRef } from "react";
import { Product } from "../../types/Products.ts";
import StarRating from "../../components/StarRating";
import { BsBasket } from "react-icons/bs";
import AddProductToBasket from "./AddProductToBasket.tsx";

interface ProductItemProps {
  item: Product;
}

const ProductItem: React.FC<ProductItemProps> = (props) => {
  const [isShowAddToBasket, setShowAddToBasket] = React.useState(false);
  const addToBasketRef = useRef<HTMLDivElement>(null);

  const handleAddToBasket = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddToBasket(true);
    console.log(`Adding ${props.item.title} to basket`);
  };

  return (
    <div className="flex-shrink-0 w-64 mx-3 transition-transform duration-300 cursor-pointer">
      {isShowAddToBasket && (
        <div
          ref={addToBasketRef}
          className="fixed w-screen h-screen bg-white/10 backdrop-blur-lg flex items-center justify-center top-0 right-0 p-2 z-10 "
        >
          <AddProductToBasket
            product={props.item}
            onClose={() => setShowAddToBasket(false)}
          />
        </div>
      )}

      <div className="p-4 bg-white rounded-3xl hover:scale-105 transition-transform duration-300 drop-shadow-md drop-shadow-pink-light/20 hover:drop-shadow-pink-light/40 overflow-hidden h-full flex flex-col">
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
            <div className="flex justify-between font-medium text-gray-900 mb-1">
              <h3 className="font-semibold text-primary-dark/90 truncate">{props.item.title}</h3>
              <span className="text-primary-dark/60 whitespace-nowrap pl-2 flex-shrink-0">sold {props.item.soldQuantity}</span>
            </div>
            <StarRating rating={props.item.averageRating} />
          </div>

          {/* Spacer to push price to bottom */}
          <div className="flex-grow mt-1"></div>

          {/*Price*/}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1">
              <span className="text-primary-dark/90">£</span>
              <p className="text-primary-dark text-lg font-semibold">{props.item.price}</p>
            </div>
            <button
              className="bg-pink-light text-white py-1 px-3 rounded-full text-sm transition-colors duration-300 w-10 h-10 flex items-center justify-center"
              onClick={handleAddToBasket}
            >
              <BsBasket/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;