import { useMutation, useQuery } from "@tanstack/react-query";
import {
  REQUEST_MY_ANALYSIS_HISTORY,
  REQUEST_SKIN_ANALYSIS_PREDICT
} from "../constants/apis";
import axios from "../settings/axios";
import { useState } from "react";
import qs from "qs";
import { GetAnalysisHistoryRequestParam, GetAnalysisHistoryResponse } from "../types/SkinAnalysis.ts";

type MetaData = {
  classes: Record<string, string>;
  conf_threshold?: number;
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
  skinType?: {
    meta: MetaData;
    predicts: { name: string; class_index: number; confidence: number, error?:string};
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

  const useFetchAnalysisHistory = (params: GetAnalysisHistoryRequestParam) => {
    return useQuery<GetAnalysisHistoryResponse>({
      queryKey: ["analysis-history", params],
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as [string, GetAnalysisHistoryRequestParam];
        const res = await axios.get<GetAnalysisHistoryResponse>(REQUEST_MY_ANALYSIS_HISTORY, {
          params,
          paramsSerializer: {
            serialize: (params) =>
              qs.stringify(params, { arrayFormat: 'repeat' })
          },});
        return res.data as GetAnalysisHistoryResponse;
      },
      refetchOnWindowFocus: false,
    });
  };
  
  return {
    isLoading,
    onSubmitAnalyzeSkin,
    useFetchAnalysisHistory
  };
};

export default useSkinAnalysis;
