import { describe, expect, it } from "vitest";
import {
  renderStyleComposition,
  resolveStyleComposition,
} from "./styleRuntime";

const catalog = {
  templates: { stardrive: { style: "@webfactory/template-stardrive/styles" } },
  themes: {
    default: { style: "@webfactory/theme-default/styles" },
    luxury: { style: "@webfactory/theme-luxury/styles" },
  },
};

describe("Web Factory style runtime", () => {
  it("resolves the default theme in runtime cascade order", () => {
    expect(
      resolveStyleComposition(
        { template: "stardrive", theme: "default" },
        catalog,
      ),
    ).toEqual([
      "@webfactory/tokens",
      "@webfactory/template-stardrive/styles",
      "@webfactory/theme-default/styles",
      "./project.css",
    ]);
  });

  it("resolves only the luxury theme when selected", () => {
    const styles = resolveStyleComposition(
      { template: "stardrive", theme: "luxury" },
      catalog,
    );
    expect(styles).toContain("@webfactory/theme-luxury/styles");
    expect(styles).not.toContain("@webfactory/theme-default/styles");
    expect(styles.at(-1)).toBe("./project.css");
  });

  it("rejects an invalid theme with the available choices", () => {
    expect(() =>
      resolveStyleComposition(
        { template: "stardrive", theme: "corporate-x" },
        catalog,
      ),
    ).toThrow(
      "Unknown Web Factory theme: corporate-x\n\nAvailable themes:\n- default\n- luxury",
    );
  });

  it("rejects an invalid template with the available choices", () => {
    expect(() =>
      resolveStyleComposition(
        { template: "missing", theme: "default" },
        catalog,
      ),
    ).toThrow(
      "Unknown Web Factory template: missing\n\nAvailable templates:\n- stardrive",
    );
  });

  it("renders the concrete selected entries into the stylesheet Astro loads", () => {
    const rendered = renderStyleComposition(
      "@import 'virtual:webfactory-template-style';\n@import 'virtual:webfactory-theme-style';",
      "@webfactory/template-stardrive/styles",
      "@webfactory/theme-luxury/styles",
    );

    expect(rendered).toContain(
      "@import '@webfactory/template-stardrive/styles'",
    );
    expect(rendered).toContain("@import '@webfactory/theme-luxury/styles'");
    expect(rendered).not.toContain("theme-default");
  });
});
