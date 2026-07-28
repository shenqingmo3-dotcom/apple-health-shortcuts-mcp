import { describe, expect, it } from "vitest";
import {
  aggregateSleep,
  handleRequest,
  normalizeIngestPayload,
  TOOLS,
  type Env,
} from "./index";

describe("clean-room health payload", () => {
  it("accepts simple Shortcut metric cards", () => {
    const result = normalizeIngestPayload({
      metrics: [
        {
          type: "heart_rate",
          value: "72 bpm",
          at: "2026-07-27T09:10:00+12:00",
        },
        {
          type: "步数",
          value: 800,
          at: "2026-07-27T12:00:00+12:00",
        },
      ],
    });

    expect(result.errors).toEqual([]);
    expect(result.metrics).toHaveLength(2);
    expect(result.metrics[0]).toMatchObject({
      metric: "heart_rate",
      value: 72,
      unit: "bpm",
    });
    expect(result.metrics[1].metric).toBe("step_count");
  });

  it("accepts Chinese sleep stages and totals detailed stages once", () => {
    const normalized = normalizeIngestPayload({
      sleep: [
        {
          stage: "核心睡眠",
          start: "2026-07-26T23:00:00+12:00",
          end: "2026-07-27T01:00:00+12:00",
        },
        {
          stage: "深度睡眠",
          start: "2026-07-27T01:00:00+12:00",
          end: "2026-07-27T02:00:00+12:00",
        },
        {
          stage: "快速眼动睡眠",
          start: "2026-07-27T02:00:00+12:00",
          end: "2026-07-27T03:30:00+12:00",
        },
        {
          stage: "睡眠",
          start: "2026-07-26T23:00:00+12:00",
          end: "2026-07-27T03:30:00+12:00",
        },
      ],
    });

    expect(normalized.errors).toEqual([]);
    const nights = aggregateSleep(normalized.sleep, "Pacific/Auckland");
    expect(nights).toHaveLength(1);
    expect(nights[0]).toMatchObject({
      totalMinutes: 270,
      coreMinutes: 120,
      deepMinutes: 60,
      remMinutes: 90,
    });
  });

  it("skips broken cards and explains why", () => {
    const result = normalizeIngestPayload({
      metrics: [{ type: "heart_rate", value: "nothing", at: "today" }],
      sleep: [{ stage: "mystery", start: "bad", end: "bad" }],
    });
    expect(result.metrics).toEqual([]);
    expect(result.sleep).toEqual([]);
    expect(result.errors).toHaveLength(2);
  });
});

describe("public surface", () => {
  it("offers exactly three read-only MCP tools", () => {
    expect(TOOLS.map((tool) => tool.name)).toEqual([
      "health_now",
      "health_detail",
      "health_trends",
    ]);
  });

  it("answers healthz without touching private data", async () => {
    const response = await handleRequest(
      new Request("https://example.test/healthz"),
      {} as Env,
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      ok: true,
      service: "apple-health-shortcuts-mcp",
    });
  });
});
