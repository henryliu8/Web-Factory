import { describe, expect, it } from "vitest";
import { resolveSection, resolveSections } from "./resolveSection";
import { z } from "zod";

describe("PageBuilder section resolution", () => {
  it("validates template sections without weakening the default schema", () => {
    const schema = z.array(
      z.object({ type: z.literal("clinic/FAQ"), title: z.string().min(1) }),
    );
    const registry = { "clinic/FAQ": "FAQ" };
    const content = [{ type: "clinic/FAQ", title: "Questions" }];
    expect(
      resolveSections(registry, content, (input) => schema.parse(input))[0]
        .component,
    ).toBe("FAQ");
    expect(() => resolveSections(registry, content)).toThrow();
    expect(() =>
      resolveSections(registry, [{ type: "clinic/FAQ" }], (input) =>
        schema.parse(input),
      ),
    ).toThrow();
    expect(() =>
      resolveSections({}, content, (input) => schema.parse(input)),
    ).toThrow("Unknown Web Factory section");
  });
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
