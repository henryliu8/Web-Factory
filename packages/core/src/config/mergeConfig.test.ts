import { describe, expect, it } from "vitest";
import { mergeConfig } from "./mergeConfig";

describe("mergeConfig", () => {
  it("lets a later layer override a simple property", () => {
    expect(mergeConfig({ mode: "shared" }, { mode: "project" })).toEqual({
      mode: "project",
    });
  });

  it("deep-merges nested plain objects and replaces arrays", () => {
    expect(
      mergeConfig(
        { site: { title: "Shared", language: "en" }, pages: ["home", "about"] },
        { site: { title: "Project" }, pages: ["contact"] },
      ),
    ).toEqual({
      site: { title: "Project", language: "en" },
      pages: ["contact"],
    });
  });

  it("applies Shared < Template < Theme < Project precedence", () => {
    const shared = { source: "shared", values: { shared: true } };
    const template = { source: "template", values: { template: true } };
    const theme = { source: "theme", values: { theme: true } };
    const project = { source: "project", values: { project: true } };

    expect(mergeConfig(shared, template, theme, project)).toEqual({
      source: "project",
      values: { shared: true, template: true, theme: true, project: true },
    });
    expect(mergeConfig(shared, template, theme).source).toBe("theme");
    expect(mergeConfig(shared, template).source).toBe("template");
  });

  it("does not mutate or retain mutable nested values from its inputs", () => {
    const shared = { nested: { value: "shared" }, pages: ["home"] };
    const project = { nested: { project: true } };
    const beforeShared = structuredClone(shared);
    const beforeProject = structuredClone(project);
    const result = mergeConfig(shared, project);

    (result.nested as Record<string, unknown>).value = "changed";
    (result.pages as string[]).push("contact");

    expect(shared).toEqual(beforeShared);
    expect(project).toEqual(beforeProject);
  });
});
