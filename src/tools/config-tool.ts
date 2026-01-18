/**
 * Config tool for Tropicalia MCP server.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BASE_URL, getProject, getApiKey } from "../config/constants.js";
import { maskApiKey } from "../utils/error-handling.js";

export function registerConfigTool(server: McpServer) {
  server.tool(
    "get_config",
    "Get current Tropicalia MCP configuration",
    {},
    () => {
      const baseUrl = BASE_URL;
      const project = getProject() || "not set";
      const apiKey = getApiKey();

      const text = `Tropicalia MCP Configuration:
- Base URL: ${baseUrl}
- Project: ${project}
- API Key: ${maskApiKey(apiKey)}

Available Tools:
- search: Search within the configured project
- get_config: Show this configuration`;

      return { content: [{ type: "text" as const, text }] };
    },
  );
}
