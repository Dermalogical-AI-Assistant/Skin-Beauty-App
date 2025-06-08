import {Product } from "../../types/Products.ts";
import { Link } from "react-router-dom";

interface ProductCarouselProps {
    products: Product[];
}

export const ProductCarousel = (props:ProductCarouselProps) => {
  return (
    <div className="mt-6 overflow-hidden">
      <p className="text-md mb-2 font-semibold">Best Solution Products</p>
      <div className="flex gap-4 overflow-auto">
        {props.products.map((p, index) => (
          <Link
            to={`/products/${p.id}`}
            key={index}
            className="flex  min-w-[120px] flex-col items-center justify-center rounded-xl bg-[#F5F5F5] text-center shadow-sm"
          >
            <div className="mb-2 h-14 w-14 rounded-full bg-gray-200">
              <img
                src={p.thumbnail}
                alt={p.title}
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <p className="text-sm">{p.title}</p>
            <p className="text-xs text-gray-500">{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
