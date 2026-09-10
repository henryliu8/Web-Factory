import { describe, expect, it } from "vitest";
import { defineProject } from "./defineProject";
import { projectConfigSchema } from "./projectSchema";

describe("project configuration", () => {
  it("accepts a valid project without coupling Core to specific template or theme names", () => {
    const config = defineProject({
      name: "Example Site",
      slug: "example-site",
      template: "custom-template",
      theme: "custom-theme",
      pages: ["home"],
      site: { url: "https://example.com", language: "en-AU" },
    });

    expect(config.template).toBe("custom-template");
    expect(config.theme).toBe("custom-theme");
  });

  it.each([
    [
      {
        name: "Missing template",
        slug: "missing-template",
        theme: "brand",
        pages: ["home"],
      },
    ],
    [
      {
        name: "Missing theme",
        slug: "missing-theme",
        template: "structure",
        pages: ["home"],
      },
    ],
    [
      {
        name: "Bad slug",
        slug: "Bad Slug",
        template: "structure",
        theme: "brand",
        pages: ["home"],
      },
    ],
  ])("rejects invalid configuration", (config) => {
    expect(projectConfigSchema.safeParse(config).success).toBe(false);
  });
});
