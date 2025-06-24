import React, { useEffect } from "react";
import { FaRedo } from "react-icons/fa";
import { AnalysisSummary } from "../../../components/AnalysisSummary";
import { ProductCarousel } from "../../../components/ProductCarousel";
import { useNavigate, useSearchParams } from "react-router-dom";
import useProducts from "../../../hooks/useProducts.ts";
import { GetProductRequestParam } from "../../../types/Products.ts";
import { toast } from "react-toastify";
import useSkinAnalysis from "../../../hooks/useSkinAnalysis.ts";
import DotLoader from "../../../components/DotLoader";

const SkinAnalysisResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');

  const createdParams: GetProductRequestParam = {
    page: 1,
    perPage: 10,
    order: "createdAt:desc"
  };

  const { getProducts } = useProducts();
  const { getSkinAnalysisDetails } = useSkinAnalysis();

  const { data: suggetData, isLoading: isSuggetLoadding, refetch: suggetRefetch } = getProducts(createdParams);
  const suggetProducts = suggetData?.data ?? [];

  // Fetch skin analysis details using the ID from query params
  const { data: skinAnalysisData, isLoading: isAnalysisLoading, error: analysisError } = getSkinAnalysisDetails(analysisId || '');

  const handleRetakePhoto = () => {
    // Logic to retake the photo
    console.log("Retake photo");
    navigate("/skin-analysis");
  };

  // Handle case where no ID is provided
  useEffect(() => {
    if (!analysisId) {
      toast.error("No analysis ID provided");
      navigate("/skin-analysis");
    }
  }, [analysisId, navigate]);

  // Handle API errors
  useEffect(() => {
    if (analysisError) {
      toast.error("Failed to load analysis details");
      console.error("Analysis error:", analysisError);
    }
  }, [analysisError]);

  // Show loading state
  if (isAnalysisLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-10">
        <DotLoader />
      </div>
    );
  }

  // Show error state
  if (analysisError || !skinAnalysisData) {
    return (
      <div className="flex h-full w-full items-center justify-center py-10">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load analysis details</p>
          <button
            onClick={() => navigate("/skin-analysis")}
            className="bg-pink-light hover:bg-pink-light/90 text-white px-4 py-2 rounded-lg"
          >
            Back to Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full py-10 gap-20">
      {/* Left - Detected Image */}
      <div className="flex w-1/2 flex-col items-end px-4">
        <div className={`w-3/4`}>
          <div className="relative aspect-square rounded-2xl bg-white/80 drop-shadow-lg">
            <div className="h-full w-full overflow-hidden rounded-xl">
              <img
                src={skinAnalysisData.image_url}
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
      <div className="w-1/2 px-4">
        <div className="w-3/4 bg-white/80 drop-shadow-lg px-10 py-5 rounded-2xl flex flex-col">
          {/* Analysis Summary at the top */}
          <div className={``}>
            <AnalysisSummary
              acneDetection={skinAnalysisData?.acneDetection}
              acneSeverity={skinAnalysisData?.acneSeverity}
              skinType={skinAnalysisData?.skinType}
            />
          </div>
          <div className="w-full mt-4">
            <ProductCarousel products={suggetProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalysisResult;