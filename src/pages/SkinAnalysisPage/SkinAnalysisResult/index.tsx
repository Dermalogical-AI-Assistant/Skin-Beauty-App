import React from "react";
import { FaRedo } from "react-icons/fa";
import { AnalysisSummary } from "../../../components/AnalysisSummary";
import { ProductCarousel } from "../../../components/ProductCarousel";
import { useLocation } from "react-router-dom";
import { useSkinAnalysis } from "../../../hooks/useSkinAnalysis";
import { DEFAULT_SKIN_ANALYSIS_URL } from "../../../constants/properties";

const SkinAnalysisResult: React.FC = () => {
  const location = useLocation();
  const { skinAnalysisId } = location.state ||  { skinAnalysisId : 2} ;
  const { getSkinAnalysis } = useSkinAnalysis(skinAnalysisId);
  const skinAnalysis = getSkinAnalysis.data;

  return (
    <div className="flex h-fit flex-col items-center justify-center gap-10 bg-[#FFF8F4] p-6 md:flex-row">
      {/* Left - Detected Image */}
      <div className="flex w-1/3 flex-col items-center">
        <div className="relative aspect-square w-fit">
          <img
            src={skinAnalysis?.imageURL ?? DEFAULT_SKIN_ANALYSIS_URL}
            alt="Analyzed face"
            className="h-full w-full rounded-xl object-cover shadow-md"
          />
        </div>
        <button className="mt-4 content-center rounded-full bg-[#F3BBA5] p-4 text-xl text-white shadow-md transition hover:scale-105">
          <FaRedo />
        </button>
      </div>

      {/* Right - Analysis Summary */}
      <div className="rounded-2xl bg-white p-4 shadow-xl md:w-[500px]">
        <AnalysisSummary
          acneDetection={skinAnalysis?.acneDetection}
          acneSeverity={skinAnalysis?.acneDetection}
          imageURL={skinAnalysis?.imageURL}
        />
        <ProductCarousel />
      </div>
    </div>
  );
};

export default SkinAnalysisResult;
