/**
 * Search tool for Tropicalia MCP server.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TropicaliaClient } from "../api/client.js";
import { getApiKey, getProject } from "../config/constants.js";
import { formatSearchError } from "../utils/error-handling.js";

const TOOL_DESCRIPTION = `Search documents in a Tropicalia project.

**Available Parameters:**

- \`query\`: Search query text (required)
- \`strategy\`: 'hybrid' | 'neural' | 'keyword' (default: hybrid)
- \`expand_query\`: Generate query variations for better recall (default: false)
- \`generate_answer\`: AI-generated completion from results (default: true)
- \`limit\`: Maximum results 1-300 (default: 50)
- \`include_sources\`: Include source documents in response (default: true)

**Natural Language Examples:**

- "Use neural search for semantic similarity" → strategy: "neural"
- "Search without expanding the query" → expand_query: false
- "Just return results, no AI summary" → generate_answer: false
- "Get more results" → limit: 100
- "Only give me the answer" → include_sources: false`;

const SearchArgsSchema = z.object({
  query: z.string().describe("Search query text"),
  strategy: z
    .enum(["hybrid", "neural", "keyword"])
    .optional()
    .describe("Retrieval strategy: 'hybrid' (default), 'neural' for semantic, 'keyword' for exact match"),
  limit: z
    .number()
    .min(1)
    .max(300)
    .optional()
    .describe("Maximum results (1-300, default: 50)"),
  generate_answer: z
    .boolean()
    .optional()
    .describe("Generate AI answer from results (default: true)"),
  expand_query: z
    .boolean()
    .optional()
    .describe("Generate query variations for better recall (default: false)"),
  include_sources: z
    .boolean()
    .optional()
    .describe("Include source documents in response (default: true)"),
});

type SearchArgs = z.infer<typeof SearchArgsSchema>;

export function registerSearchTool(server: McpServer) {
  server.tool(
    "search",
    TOOL_DESCRIPTION,
    SearchArgsSchema.shape,
    async (args: SearchArgs) => {
      const apiKey = getApiKey();
      const projectId = getProject();

      if (!apiKey) {
        return formatSearchError(
          new Error("No API key provided. Set TROPICALIA_API_KEY env var."),
          { projectId, query: args.query }
        );
      }

      if (!projectId) {
        return formatSearchError(
          new Error("TROPICALIA_PROJECT env var not set"),
          { query: args.query }
        );
      }

      try {
        const client = new TropicaliaClient({ apiKey });
        const result = await client.search(projectId, {
          query: args.query,
          retrieval_strategy: args.strategy,
          limit: args.limit,
          generate_answer: args.generate_answer,
          expand_query: args.expand_query,
          include_sources: args.include_sources,
        });

        // Format response for LLM consumption
        const outputParts: string[] = [];

        // Header with project context
        outputParts.push(`**Project:** ${projectId}`);

        if (result.completion) {
          outputParts.push(`\n## Answer\n${result.completion}`);
        }

        const contents = result.retrieval_contents ?? [];
        if (contents.length > 0) {
          outputParts.push(`\n**Results:** ${contents.length}`);
          contents.forEach((item) => {
            const title = item.metadata?.document_title ?? "Untitled";
            const score = item.score?.toFixed(3) ?? "N/A";

            // Build metadata line
            const metaParts: string[] = [];
            if (item.metadata?.file_name) metaParts.push(item.metadata.file_name);
            if (item.metadata?.page) metaParts.push(`Page: ${item.metadata.page}`);
            if (item.metadata?.type) metaParts.push(`Type: ${item.metadata.type}`);
            const metaLine = metaParts.length > 0 ? metaParts.join(" | ") : "";

            // Content with fallback chain
            const content =
              item.document ??
              item.metadata?.content ??
              item.metadata?.text ??
              "(no content)";

            outputParts.push(`\n### ${item.number}. ${title} (Score: ${score})`);
            if (metaLine) outputParts.push(metaLine);
            outputParts.push(String(content));
          });
        }

        return {
          content: [
            {
              type: "text" as const,
              text: outputParts.length > 0 ? outputParts.join("\n") : "No results found",
            },
          ],
        };
      } catch (error) {
        return formatSearchError(error, { projectId, query: args.query });
      }
    }
  );
}
