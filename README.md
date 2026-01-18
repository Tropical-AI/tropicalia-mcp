# Tropicalia MCP Server

MCP server exposing Tropicalia search functionality to AI assistants.

## Installation

```bash
npm install -g tropicalia-mcp
```

Or use directly with npx:

```bash
npx tropicalia-mcp
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TROPICALIA_API_KEY` | API key for authentication | (required) |
| `TROPICALIA_PROJECT` | Project ID for this connection | (required) |

## Claude Desktop Configuration

```json
{
  "mcpServers": {
    "tropicalia": {
      "command": "npx",
      "args": ["-y", "tropicalia-mcp"],
      "env": {
        "TROPICALIA_API_KEY": "tr_xxx",
        "TROPICALIA_PROJECT": "prj_xxx"
      }
    }
  }
}
```

## Available Tools

### search

Search documents in a Tropicalia project.

**Parameters:**
- `query` (required): Search query text
- `strategy`: Retrieval strategy - `hybrid` (default), `neural`, or `keyword`
- `limit`: Maximum results (1-300, default: 50)
- `generate_answer`: Generate AI answer from results (default: true)
- `expand_query`: Generate query variations for better recall (default: false)
- `include_sources`: Include source documents in response (default: true)

### get_config

Display current configuration and available tools.

## Development

```bash
# Install dependencies
npm install

# Run with MCP inspector
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Build
npm run build
```
