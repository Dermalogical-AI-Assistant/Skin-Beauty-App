
export type GetAnalysisHistoryRequestParam = {
  page?: number;
  per_page?: number;
}

export type AnalysisHistory= {
  id: string;
  image_url: string;
  created_at: string;
  skin_type?: string;
  severity_level?: string;
  total_detections?: number;
}

export type GetAnalysisHistoryResponse = {
  analyses:AnalysisHistory[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}
