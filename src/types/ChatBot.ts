export interface PaginatedMeta {
  page: string;
  perPage: string;
  total: number;
}

export interface PaginatedResponse<T> {
  meta: PaginatedMeta;
  data: T[];
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  createdAt: Date;
}