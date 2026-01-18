/**
 * Error handling utilities for MCP tools.
 */

export type McpToolResponse = {
  [key: string]: unknown;
  content: { type: "text"; text: string }[];
};

export class TropicaliaError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "TropicaliaError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof TropicaliaError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function formatError(error: unknown): string {
  return `Error: ${getErrorMessage(error)}`;
}

export function formatSearchError(
  error: unknown,
  context: { projectId?: string; query?: string }
): McpToolResponse {
  const message = getErrorMessage(error);
  const projectId = context.projectId ?? "not set";

  const text = `**Error:** ${message}

**Debug Info:**
- Project: ${projectId}
- Query: ${context.query ?? "none"}
- Endpoint: /v1/projects/${projectId}/search`;

  return {
    content: [{ type: "text", text }],
  };
}

export function maskApiKey(key: string): string {
  if (!key) return "not set";
  if (key.length <= 6) return "***";
  return `${key.slice(0, 6)}...`;
}
