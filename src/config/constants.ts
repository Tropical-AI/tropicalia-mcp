/**
 * Environment configuration constants for Tropicalia MCP server.
 */

export const ENV = {
  API_KEY: "TROPICALIA_API_KEY",
  PROJECT: "TROPICALIA_PROJECT",
} as const;

export const BASE_URL = "https://api.tropicalia.dev";

export function getEnv(key: string, defaultValue = ""): string {
  return process.env[key] ?? defaultValue;
}

export function getApiKey(): string {
  return getEnv(ENV.API_KEY);
}

export function getProject(): string {
  return getEnv(ENV.PROJECT);
}
