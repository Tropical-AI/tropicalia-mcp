import { describe, it, expect, vi, beforeEach } from "vitest";
import { TropicaliaClient } from "../src/api/client.js";

describe("TropicaliaClient", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates client with API key", () => {
    const client = new TropicaliaClient({ apiKey: "test-key" });
    expect(client).toBeDefined();
  });

  it("search makes POST request", async () => {
    const mockResponse = {
      completion: "Test answer",
      retrieval_contents: [{ content: "Test content", title: "Test" }],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const client = new TropicaliaClient({ apiKey: "test-key" });

    const result = await client.search("prj_123", { query: "test query" });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.tropicalia.dev/v1/projects/prj_123/search",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("throws on API error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: () => Promise.resolve({ detail: "Invalid API key" }),
    });

    const client = new TropicaliaClient({ apiKey: "bad-key" });

    await expect(
      client.search("prj_123", { query: "test" })
    ).rejects.toThrow("Invalid API key");
  });
});
