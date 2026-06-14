export interface Source {
  title?: string;
  source?: string;
  period?: string;
  url?: string;
  fileName?: string;
  file_name?: string;
  chunkIndex?: number;
  chunk_index?: number;
}

export type FeedbackRating = "LIKE" | "DISLIKE";

export interface Message {
  id: string;
  messageId?: number;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  sources?: Source[];
  feedback?: FeedbackRating;
}

export interface ChatApiResponse {
  sessionId: number;
  aiMessageId?: number;
  answer: string;
  sources: Source[];
}

export interface ChatSession {
  id: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessageFromApi {
  id: number;
  sender: "USER" | "AI";
  message: string;
  sources?: string | null;
  createdAt?: string;
}