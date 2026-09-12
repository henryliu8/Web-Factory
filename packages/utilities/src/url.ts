export function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

export function joinUrlPath(...segments: string[]): string {
  const path = segments.map(trimSlashes).filter(Boolean).join("/");
  return path ? `/${path}` : "/";
}

export function normalizePathTrailingSlash(
  path: string,
  trailingSlash?: boolean,
): string {
  if (trailingSlash === undefined || path === "" || path === "/") return path;

  const [, pathname = "", suffix = ""] = path.match(/^([^?#]*)(.*)$/) ?? [];
  const normalized = pathname.replace(/\/+$/, "");
  return `${normalized}${trailingSlash ? "/" : ""}${suffix}`;
}
