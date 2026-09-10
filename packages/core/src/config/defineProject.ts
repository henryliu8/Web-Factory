import { parseProjectConfig, type ProjectConfig } from "./projectSchema";

export function defineProject(config: unknown): ProjectConfig {
  return parseProjectConfig(config);
}
