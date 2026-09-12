import { describe, expect, it } from "vitest";
import { joinUrlPath, normalizePathTrailingSlash, trimSlashes } from "./url";

describe("URL utilities", () => {
  it("joins path segments without duplicate slashes", () => {
    expect(joinUrlPath("/docs/", "/guides/", "start")).toBe(
      "/docs/guides/start",
    );
  });

  it("normalizes trailing slashes without moving query strings", () => {
    expect(normalizePathTrailingSlash("/docs/?page=2", false)).toBe(
      "/docs?page=2",
    );
    expect(normalizePathTrailingSlash("/docs?page=2", true)).toBe(
      "/docs/?page=2",
    );
  });

  it("preserves the root path", () => {
    expect(normalizePathTrailingSlash("/", false)).toBe("/");
    expect(normalizePathTrailingSlash("", true)).toBe("");
    expect(trimSlashes("///docs///")).toBe("docs");
  });
});
