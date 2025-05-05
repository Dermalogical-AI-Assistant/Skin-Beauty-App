import { useQuery } from "@tanstack/react-query";
import { REQUEST_SKIN_ANALYSIS_PREDICT } from "../constants/apis";
import axios from "../settings/axios";

type MetaData = {
  classes: Record<string, string>;
  conf_threshold: number;
};

export type AcneDetection = {
  name: string;
  class: number;
  confidence: number;
  box: { x1: number; y1: number; x2: number; y2: number };
  color: [number, number, number];
};

type AcneSeverity = {
  name: string;
  class: number;
  confidence: number;
};

export type SkinAnalysisResult = {
  acneDetection?: {
    meta: MetaData;
    predicts: AcneDetection[];
  };
  acneSeverity?: {
    meta: MetaData;
    predicts: AcneSeverity[];
  };
  imageURL?: string;
};

export const useSkinAnalysis = (skinAnalysisId: string | null) => {
  const getSkinAnalysis = useQuery<SkinAnalysisResult, Error>({
    queryKey: ["skin-analysis", skinAnalysisId],
    queryFn: async () => {
      if (!skinAnalysisId) throw new Error("No skinAnalysisId provided");

      const response = await axios.get(
        `${REQUEST_SKIN_ANALYSIS_PREDICT}/${skinAnalysisId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            conf: 0.6,
          },
        },
      );

      return response.data;
    },
  });
  return { getSkinAnalysis };
};
