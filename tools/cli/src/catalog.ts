import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { repositoryRoot } from "./paths";

export function listTemplates(start = process.cwd()): string[] {
  return listPackages(
    resolve(repositoryRoot(start), "templates"),
    "@webfactory/template-",
  );
}

export function listThemes(start = process.cwd()): string[] {
  return listPackages(
    resolve(repositoryRoot(start), "themes"),
    "@webfactory/theme-",
  );
}

function listPackages(path: string, packagePrefix: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory() || entry.name.startsWith(".")) return false;
      const manifestPath = resolve(path, entry.name, "package.json");
      if (!existsSync(manifestPath)) return false;
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
          name?: unknown;
        };
        return manifest.name === `${packagePrefix}${entry.name}`;
      } catch {
        return false;
      }
    })
    .map((entry) => entry.name)
    .sort();
}
