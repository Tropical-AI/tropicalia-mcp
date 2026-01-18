/**
 * MCP server factory for Tropicalia.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchTool } from "./tools/search-tool.js";
import { registerConfigTool } from "./tools/config-tool.js";

/**
 * Creates a configured MCP server with all Tropicalia tools registered.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "tropicalia",
    version: "0.1.0",
  });

  registerSearchTool(server);
  registerConfigTool(server);

  return server;
}
