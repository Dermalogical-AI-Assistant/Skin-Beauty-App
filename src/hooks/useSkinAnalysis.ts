import { useMutation, useQuery } from "@tanstack/react-query";
import { REQUEST_FILES_MODULE, REQUEST_SKIN_ANALYSIS_PREDICT } from "../constants/apis";
import axios from "../settings/axios";
import { UploadFileResponse } from "../types/Files.ts";
import { useState } from "react";

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

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    handleAnalyzeSkin.mutate(data, {
      onSuccess: (response) => {
        setIsLoading(false);
        onSuccess?.(response.data);
      },
      onError: (error) => {
        setIsLoading(false);
        console.log(error);
        onError(error);
      }
    });
  };
  
  return {
    isLoading,
    onSubmitAnalyzeSkin };
};

export default useSkinAnalysis;
