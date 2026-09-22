/** Only the server decides this; never read a bypass flag from the request body. */
export function canBypassRecaptcha(
  development: boolean,
  flag: string | undefined,
  url: URL,
): boolean {
  return (
    development &&
    flag === "true" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  );
}
