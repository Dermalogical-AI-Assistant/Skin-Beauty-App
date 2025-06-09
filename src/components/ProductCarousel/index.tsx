import {Product } from "../../types/Products.ts";
import { Link } from "react-router-dom";

interface ProductCarouselProps {
  products: Product[];
}

export const ProductCarousel = (props:ProductCarouselProps) => {
  return (
    <div className="mt-6 w-full">
      <p className="text-lg mb-4 font-semibold text-gray-800">Best Solution Products</p>
      <div className="flex gap-3 overflow-x-auto pb-2 ">
        {props.products.map((p, index) => (
          <Link
            to={`/products/${p.id}`}
            key={index}

            className="flex-shrink-0 min-w-[140px] w-[140px] h-[160px] flex flex-col items-center justify-between p-3 rounded-xl bg-secondary/20 drop-shadow-2xl border border-gray-100 hover:border-pink-200 text-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <div className="mb-2 h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
              <img
                src={p.thumbnail}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center flex-grow justify-center">
              <p className="text-sm font-medium text-gray-800 text-center line-clamp-2 leading-tight mb-1">
                {p.title}
              </p>
              <p className="text-sm font-semibold text-pink-light">£{p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};