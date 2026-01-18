/**
 * API response types for Tropicalia backend.
 */

export interface RetrievalContentMetadata {
  document_title?: string;
  document_id?: string;
  file_name?: string;
  type?: string;
  chunk_index?: number;
  chunk_size?: number;
  page?: number;
  date_created?: string;
  content?: string;
  text?: string;
}

export interface RetrievalContent {
  id: string;
  document: string;
  score: number;
  metadata?: RetrievalContentMetadata;
  number: number;
}

export interface SearchResponse {
  completion?: string;
  retrieval_contents: RetrievalContent[];
}

export interface SearchParams {
  query: string;
  retrieval_strategy?: "hybrid" | "neural" | "keyword";
  limit?: number;
  generate_answer?: boolean;
  expand_query?: boolean;
  include_sources?: boolean;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}
