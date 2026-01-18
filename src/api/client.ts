/**
 * HTTP client for Tropicalia backend API.
 */

import { BASE_URL } from "../config/constants.js";
import type { SearchParams, SearchResponse, ApiError } from "./types.js";

export class TropicaliaClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(options: { apiKey: string }) {
    this.baseUrl = BASE_URL;
    this.apiKey = options.apiKey;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }))) as ApiError;
      throw new Error(error.detail);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Search project documents.
   *
   * @param projectId - Project public ID (e.g., prj_xxx)
   * @param params - Search parameters
   * @returns Search response with completion and retrieval_contents
   */
  async search(projectId: string, params: SearchParams): Promise<SearchResponse> {
    return this.request<SearchResponse>(
      "POST",
      `/v1/projects/${projectId}/search`,
      params
    );
  }
}
