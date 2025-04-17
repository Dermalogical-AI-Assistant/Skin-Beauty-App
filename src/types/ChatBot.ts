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
  sessionId?: string;
  message: string;
  sender: "USER" | "SYSTEM";
  createdAt?: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  createdAt: Date;
}

export interface NewMessage {
  sessionId: string;
  sender: "USER" | "SYSTEM";
  message: string;
}