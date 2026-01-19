/**
 * MCP server factory for Tropicalia.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchTool } from "./tools/search-tool.js";
import { registerConfigTool } from "./tools/config-tool.js";
import type { McpContext } from "./api/types.js";

/**
 * Registers all Tropicalia tools on an existing MCP server.
 * @param server - The MCP server instance
 * @param context - Optional context with projectId and apiKey (for HTTP transport)
 */
export function registerTools(server: McpServer, context?: McpContext): void {
  registerSearchTool(server, context);
  registerConfigTool(server, context);
}

/**
 * Creates a configured MCP server with all Tropicalia tools registered.
 * Used for stdio transport (no context needed, uses env vars).
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "tropicalia",
    version: "0.1.0",
  });

  registerTools(server);

  return server;
}
