import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductSection from "./Sections/ProductSection.tsx";
import { GetProductRequestParam } from "../../types/Products.ts";
import useProducts from "../../hooks/useProducts.ts";
import { ROUTE_CHATBOT, ROUTE_PRODUCTS, ROUTE_SKIN_ANALYSIS } from "../../constants/routes.ts";
import { SkincareConcern } from "../../types/SkincareConcern.ts";

const HomePage: React.FC = () => {

  const {getProducts} = useProducts();

  const navigate = useNavigate();
  const newestParams: GetProductRequestParam = {
    page:0,
    perPage: 10,
    order:"createdAt:desc"
  };

  const { data:newestData, isLoading:isNewestLoading, refetch:newestRefetch } = getProducts(newestParams);
  const newestProducts = newestData?.data ?? [];

  const bestSellerParams: GetProductRequestParam = {
    page: 0,
    perPage: 10,
    order: "bestSeller:desc"
  };
  const { data:bestSellerData, isLoading:isBestSellerLoading, refetch:bestSellerRefetch } = getProducts(bestSellerParams);
  const bestSellerProducts = bestSellerData?.data ?? [];

  return (
    <div className={`bg-primary relative flex flex-col`}>
      <div>
        <section className={`h-screen`}>
          <div className="flex h-full w-full justify-center px-32">
            {/* Cột trái */}
            <div className="flex flex-col justify-center">
              <div className="">
                <div className={`font-playfair text-primary-dark mb-5`}>
                  <h1 className={`truncate text-9xl font-black`}>
                    Radiate your
                  </h1>
                  <h1 className={`truncate text-9xl font-black`}>
                    inner beauty
                  </h1>
                </div>
                <div
                  className={`border-primary-dark/80 font-playfair text-primary-dark/70 ml-2 w-4/6 border-l-3 pl-2 text-xl`}
                >
                  <span>
                    Discover skincare products, get personalized recommendations
                    from our AI chatbot, and analyze your skin for acne and
                    concerns — all in one place.
                  </span>
                </div>
              </div>
              <div className={`m-1 flex items-center`}>
                <Link
                  className={`drop-shadow-pink-light bg-pink-light hover:bg-pink-dark m-1 mt-5 rounded-full p-3 text-lg font-bold text-white drop-shadow-lg transition duration-300 ease-in-out`}
                  to={ROUTE_CHATBOT}
                >
                  💬 Talk to Our Beauty Chatbot
                </Link>
                <Link
                  className={`text-primary-dark hover:bg-pink-dark m-1 mt-5 rounded-full bg-white p-3 text-lg font-bold drop-shadow-[0_4px_40px] drop-shadow-lg transition duration-300 ease-in-out`}
                  to={ROUTE_SKIN_ANALYSIS}
                >
                  📷 Analyze Skin
                </Link>
              </div>
            </div>

            {/* Cột phải */}
            <div className="flex w-full items-center justify-center">
              <img
                src={`https://res.cloudinary.com/dk6ivhi6t/image/upload/v1748838836/uploads/TDCosmetic/oblulewejqhqebkvepoz.png`}
                alt="logo"
                className="w-full object-contain"
              />
            </div>
          </div>
        </section>

        {/*Skincare Concern*/}
        <section className={`flex flex-col items-center justify-center`}>
          <div className={`border-primary-dark/20 w-1/2 border`}></div>
          <div className={`my-3 flex flex-col items-center justify-center`}>
            <h2 className={`text-primary-dark drop-shadow-2xl drop-shadow-pink-light p-4 text-2xl font-bold`}>
              Skincare Concerns
            </h2>
            <div className="flex h-full w-full flex-wrap justify-center py-2">
              {
                SkincareConcern.getAll().map((item, index) => (
                  <Link
                    to={`${ROUTE_PRODUCTS}?pageTitle=${item.label}&skincareConcerns=${item.value}`}
                    key={index}
                    className=" mx-2 my-1 rounded-full p-3 font-bold text-nowrap text-primary-dark/80 hover:scale-110 hover:text-primary-dark hover:bg-white/50 hover:shadow-primary  transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                ))}
            </div>
          </div>
          <div className={`border-primary-dark/20 w-1/2 border`}></div>
        </section>

        <section className={`my-10`}>
          <div className="flex h-full w-full justify-center px-32">
            <ProductSection title={"Newest"} items={newestProducts} onViewAll={()=>{navigate(`${ROUTE_PRODUCTS}?pageTitleNew%20Products&filter=createdAt%3Aasc`)}} />
          </div>
        </section>
        <section className={``}>
          <div className="flex h-full w-full justify-center px-32">
            <ProductSection title={"Best seller"} items={bestSellerProducts}  onViewAll={ ()=>{ navigate(`${ROUTE_PRODUCTS}?pageTitle=Best%20Seller&filter=bestSeller%3Aasc`)}}/>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;