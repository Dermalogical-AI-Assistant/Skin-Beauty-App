export interface ResUploadImage {
  success: boolean;
  message: string;
  publicId?: string;
  url?: string;
  secureUrl?: string;
  format?: string;
  resourceType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  folder?: string;
  originalFilename?: string;
  images?: ImageInfo[]; // For multiple upload
  metadata?: Record<string, any>;
}

export interface ImageInfo {
  publicId: string;
  url: string;
  secureUrl: string;
  originalFilename: string;
  bytes: number;
  width: number;
  height: number;
}