import React, { useEffect } from "react";
import { FaRedo, FaTimes, FaUpload } from "react-icons/fa";
import { AnalysisSummary } from "../../../components/AnalysisSummary";
import { ProductCarousel } from "../../../components/ProductCarousel";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_SKIN_ANALYSIS_URL } from "../../../constants/properties";
import ProductSection from "../../HomePage/Sections/ProductSection.tsx";
import useProducts from "../../../hooks/useProducts.ts";
import { GetProductRequestParam } from "../../../types/Products.ts";
import { toast } from "react-toastify";

const SkinAnalysisResult: React.FC = () => {

  const navigate = useNavigate();

  const createdParams: GetProductRequestParam = {
    page: 1,
    perPage: 10,
    order: "createdAt:desc"
  };
  const {getProducts} = useProducts();
  const { data:suggetData, isLoading:isSuggetLoadding, refetch:suggetRefetch } = getProducts(createdParams);
  const suggetProducts = suggetData?.data ?? [];

  const location = useLocation();
  const { data:skinAnalysisData, url } = location.state || {};

  const handleRetakePhoto = () => {
    // Logic to retake the photo
    console.log("Retake photo");
    navigate("/skin-analysis");
  }

  return (
    <div className="flex h-full w-full py-10 gap-20  ">
      {/* Left - Detected Image */}
      <div className="flex w-1/2 flex-col items-end px-4 ">
        <div className={`w-3/4`}>
          <div className="relative aspect-square rounded-2xl bg-white/80 drop-shadow-lg">
            <div className="h-full w-full overflow-hidden rounded-xl">
              <img
                src={skinAnalysisData?.imageURL}
                alt="Analyzed face"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className={`flex w-full justify-center`}>
            <button
              className="mt-4 content-center rounded-full bg-pink-light p-5 text-3xl text-white shadow-md transition hover:scale-105"
              onClick={() => handleRetakePhoto()}
            >
              <FaRedo size={20}/>
            </button>
          </div>
        </div>
      </div>

      {/* Right - Analysis Summary */}
      <div className="w-1/2   px-4 ">
        <div className="w-3/4 bg-white/80 drop-shadow-lg px-10 py-5 rounded-2xl flex flex-col">
          {/* Analysis Summary at the top */}
          <div className={``}>
            <AnalysisSummary
              acneDetection={skinAnalysisData?.acneDetection}
              acneSeverity={skinAnalysisData?.acneSeverity}
              imageURL={skinAnalysisData?.imageURL}
              skinType={skinAnalysisData?.skinType}
            />
          </div>
          <div className="w-full  overflow-hidden flex">
            <ProductCarousel  products={suggetProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalysisResult;