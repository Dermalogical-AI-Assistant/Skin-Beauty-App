import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BsBasket } from "react-icons/bs";
import StarRating from "../../../components/StarRating";
import { Product } from "../../../types/Products.ts";
import { Link } from "react-router-dom";
import { ROUTE_PRODUCTS } from "../../../constants/routes.ts";
import { Currency } from "../../../types/Currency.ts";

interface HorizontalProductScrollProps {
  title?: string;
  items: Product[];
}

const HorizontalProductScroll: React.FC<HorizontalProductScrollProps> = (props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Kiểm tra cần hiển thị mũi tên nào
  const checkArrows = () => {
    if (!scrollRef.current) return;

    setShowLeftArrow(scrollRef.current.scrollLeft > 0);
    setShowRightArrow(
      scrollRef.current.scrollLeft <
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
    );
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkArrows);
      // Kiểm tra ban đầu
      checkArrows();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkArrows);
      }
    };
  }, []);

  // Xử lý scroll
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Xử lý drag scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    if (scrollRef.current) {
      const x = e.pageX - (scrollRef.current.offsetLeft || 0);
      const walk = (x - startX) * 1.5; // Tốc độ scroll
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Xử lý touch events cho mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    if (scrollRef.current) {
      const x = e.touches[0].pageX - (scrollRef.current.offsetLeft || 0);
      const walk = (x - startX) * 1.5;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleViewAll = () => {
    console.log("Xem tất cả sản phẩm");
    // Thêm navigation hoặc action khi click vào View All
  };

  return (
    <div className="relative w-full mx-auto">
      {
        props.title&&(<h2 className="text-2xl font-semibold font-encode-sans text-primary-dark/70 mb-1 pl-4 ">{props.title}</h2>)
      }

      {/* Navigation arrows */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow-lg p-2 focus:outline-none transition-all duration-300 -ml-3"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full shadow-lg p-2 focus:outline-none transition-all duration-300 -mr-3"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>
      )}

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll scrollbar-hide scroll-smooth py-4 px-2 -mx-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={checkArrows}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Product items */}
        {props.items.map((item, index) => (
          <Link
            to={`${ROUTE_PRODUCTS}/${item.id}`}
            key={index}
            className="flex-shrink-0 w-64 mx-3 transition-transform hover:scale-105 duration-300 cursor-pointer"
          >
            <div className="p-4 bg-white rounded-3xl drop-shadow-md drop-shadow-pink-light/20 hover:drop-shadow-pink-light/40 overflow-hidden h-full flex flex-col">

              {/*item image*/}
              <div className="relative h-48 overflow-hidden rounded-3xl drop-shadow-lg drop-shadow-pink-light/20 bg-white mb-2">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="flex flex-col flex-grow">
                {/*Product title*/}
                <div className="mb-2">
                  <div className={`flex justify-between font-medium text-gray-900 mb-1`}>
                    <h3 className="font-semibold text-primary-dark/90 truncate">{item.title}</h3>
                    <span className={`text-primary-dark/60 whitespace-nowrap pl-2 flex-shrink-0`}>sold {item.soldQuantity}</span>
                  </div>
                  <StarRating rating={item.averageRating} />
                </div>

                {/* Spacer to push price to bottom */}
                <div className="flex-grow mt-1"></div>

                {/*Price*/}
                <div className={`flex justify-between items-center mt-2`}>
                  <div className={`flex items-center`}>
                    <span>{Currency.getSymbol(item.currency)}</span>
                    <p className="text-primary-dark text-lg font-semibold">{item.price}</p>
                  </div>
                  <button className="bg-pink-light text-white py-1 px-3 rounded-full text-sm transition-colors duration-300 w-10 h-10 flex items-center justify-center">
                    <BsBasket/>
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* View All item */}
        <div
          className="flex-shrink-0 w-40 mx-2 cursor-pointer"
          onClick={handleViewAll}
        >
          <div className="bg-pink-light/10 hover:bg-pink-light/15 rounded-lg shadow-md overflow-hidden h-full flex flex-col items-center justify-center p-4 transition-all duration-300">
            <div className="rounded-full bg-pink-light/10 p-3 mb-3">
              <ChevronRight size={24} className="text-pink-light/90" />
            </div>
            <h3 className="font-semibold text-primary-dark/90">Xem tất cả</h3>
            <p className="text-sm text-primary-dark/70">Tất cả sản phẩm</p>
          </div>
        </div>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center mt-4">
        <div className="space-x-1">
          {Array.from({ length: Math.ceil((props.items.length + 1) / 4) }).map((_, i) => (
            <span
              key={i}
              className={`inline-block w-2 h-2 rounded-full ${
                scrollRef.current &&
                scrollRef.current.scrollLeft > i * scrollRef.current.clientWidth * 0.75 - 50 &&
                scrollRef.current.scrollLeft < (i + 1) * scrollRef.current.clientWidth * 0.75 - 50
                  ? 'bg-pink-light'
                  : 'bg-pink-light/20'
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalProductScroll;