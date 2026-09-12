import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./serializeJsonLd";

describe("serializeJsonLd", () => {
  it("cannot terminate its script element", () => {
    expect(
      serializeJsonLd({ name: "</script><script>alert(1)</script>" }),
    ).toBe('{"name":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}');
  });
});
