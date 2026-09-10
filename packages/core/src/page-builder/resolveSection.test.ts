import { describe, expect, it } from "vitest";
import { resolveSection } from "./resolveSection";

describe("PageBuilder section resolution", () => {
  it("resolves a registered section by logical path", () => {
    expect(
      resolveSection(
        { "hero/HeroFullscreen": "Hero" },
        { type: "hero/HeroFullscreen" },
      ),
    ).toBe("Hero");
  });

  it("reports the unknown section and available logical paths", () => {
    expect(() =>
      resolveSection(
        { "hero/HeroFullscreen": "Hero" },
        { type: "missing/Section" },
      ),
    ).toThrow(
      'Unknown Web Factory section "missing/Section". Available sections: hero/HeroFullscreen.',
    );
  });
});
