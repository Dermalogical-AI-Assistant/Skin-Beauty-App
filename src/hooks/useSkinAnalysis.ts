import { useMutation, useQuery } from "@tanstack/react-query";
import { REQUEST_FILES_MODULE, REQUEST_SKIN_ANALYSIS_PREDICT } from "../constants/apis";
import axios from "../settings/axios";
import { UploadFileResponse } from "../types/Files.ts";

type MetaData = {
  classes: Record<string, string>;
  conf_threshold: number;
};

export type AcneDetection = {
  name: string;
  classes: number;
  confidence: number;
  box: { x1: number; y1: number; x2: number; y2: number };
  color: [number, number, number];
};

type AcneSeverity = {
  name: string;
  classes: number;
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

function useSkinAnalysis (){
  const handleAnalyzeSkin = useMutation({
    mutationKey: ["analyze-skin"],
    mutationFn: (data: FormData) => {
      return axios.post<SkinAnalysisResult>(REQUEST_SKIN_ANALYSIS_PREDICT, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  const onSubmitAnalyzeSkin = (
    data: FormData,
    onSuccess: (response:SkinAnalysisResult) => void,
    onError: (error:Error) => void) => {
    handleAnalyzeSkin.mutate(data, {
      onSuccess: (response) => {
        onSuccess?.(response.data);
      },
      onError: (error) => {
        console.log(error);
        onError(error);
      }
    });
  };
  
  return { onSubmitAnalyzeSkin };
};

export default useSkinAnalysis;
