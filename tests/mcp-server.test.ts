import { describe, it, expect, vi, beforeEach } from "vitest";
import { createServer } from "../src/server.js";

describe("MCP Server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates server with tools registered", () => {
    const server = createServer();
    expect(server).toBeDefined();
  });

  it("creates server with custom API key getter", () => {
    const getRequestApiKey = vi.fn(() => "test-key");
    const server = createServer({ getRequestApiKey });
    expect(server).toBeDefined();
  });
});
