#!/usr/bin/env node
/**
 * Tropicalia MCP HTTP server entry point.
 */

import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerTools } from "./server.js";

const app = express();
app.use(express.json());

app.all("/:projectId/mcp", async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const apiKey = authHeader.replace("Bearer ", "");

  // Create server with context per request (stateless)
  const server = new McpServer({
    name: "tropicalia",
    version: "0.1.0",
  });

  registerTools(server, { projectId, apiKey });

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // Stateless mode
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tropicalia MCP HTTP server running on port ${PORT}`);
});
