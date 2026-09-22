import { test } from "node:test";
import assert from "node:assert/strict";
import { canBypassRecaptcha } from "../src/config/contactDevelopment";
import { handleContactRequest } from "../src/server/contact";

const config = {
  apiKey: "server-resend-secret",
  from: "website@example.com",
  to: "clinic@example.com",
  recaptchaSecret: "server-captcha-secret",
  origin: "https://clinic.example",
};
const submission = {
  name: "Test Visitor",
  email: "visitor@example.com",
  phone: "+61 400 000 000",
  service: "Occupational Therapy",
  message: "This is an automated test enquiry.",
  website: "",
  captchaToken: "mock-token",
  submissionId: "08c3f628-573b-4351-a7e4-e810d70950be",
};
const request = (
  body: unknown = submission,
  headers: Record<string, string> = {},
) =>
  new Request("https://clinic.example/api/contact/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: config.origin,
      ...headers,
    },
    body: JSON.stringify(body),
  });

function provider(
  verification: unknown = { success: true, hostname: "clinic.example" },
  emailStatus = 200,
) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const url = String(input);
    calls.push({ url, init });
    if (url === "https://www.google.com/recaptcha/api/siteverify")
      return Response.json(verification);
    assert.equal(url, "https://api.resend.com/emails");
    return Response.json(
      emailStatus === 200
        ? { id: "accepted-id" }
        : { message: "private upstream details" },
      { status: emailStatus },
    );
  };
  return { calls, fetcher };
}

test("valid captcha sends to the configured recipient with visitor Reply-To and stable idempotency", async () => {
  const mock = provider();
  const result = await handleContactRequest(request(), config, mock.fetcher);
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true, code: "success" });
  assert.equal(mock.calls.length, 2);
  const verify = mock.calls[0].init!;
  assert.equal(
    (verify.body as URLSearchParams).get("secret"),
    config.recaptchaSecret,
  );
  assert.equal(
    (verify.body as URLSearchParams).get("response"),
    submission.captchaToken,
  );
  const email = JSON.parse(mock.calls[1].init!.body as string);
  assert.deepEqual(email.to, [config.to]);
  assert.equal(email.from, config.from);
  assert.equal(email.reply_to, submission.email);
  assert.ok(email.text.includes(submission.message));
  assert.equal(email.html, undefined);
  assert.equal(
    new Headers(mock.calls[1].init!.headers).get("idempotency-key"),
    `contact/${submission.submissionId}`,
  );
  assert.equal(
    new Headers(mock.calls[1].init!.headers).get("authorization"),
    `Bearer ${config.apiKey}`,
  );
});

test("invalid requests are rejected before any provider call", async () => {
  const mock = provider();
  for (const body of [
    { ...submission, captchaToken: "" },
    { ...submission, email: "not-email" },
    { ...submission, name: "Name\nBcc: other@example.com" },
    { ...submission, message: "x".repeat(5001) },
    { ...submission, service: "Unknown" },
    { ...submission, website: "spam" },
    { ...submission, to: "attacker@example.com" },
    { ...submission, submissionId: "arbitrary" },
  ]) {
    assert.equal(
      (await handleContactRequest(request(body), config, mock.fetcher)).status,
      400,
    );
  }
  assert.equal(
    (
      await handleContactRequest(
        request(submission, { Origin: "https://other.example" }),
        config,
        mock.fetcher,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleContactRequest(
        request(submission, { "Content-Type": "text/plain" }),
        config,
        mock.fetcher,
      )
    ).status,
    415,
  );
  assert.equal(
    (
      await handleContactRequest(
        request(submission, { "Content-Length": "40000" }),
        config,
        mock.fetcher,
      )
    ).status,
    413,
  );
  assert.equal(
    (
      await handleContactRequest(
        request({ ...submission, message: "x".repeat(40000) }),
        config,
        mock.fetcher,
      )
    ).status,
    413,
  );
  const malformed = new Request("https://clinic.example/api/contact/", {
    method: "POST",
    headers: { Origin: config.origin, "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(
    (await handleContactRequest(malformed, config, mock.fetcher)).status,
    400,
  );
  assert.equal(mock.calls.length, 0);
});

test("failed, expired, replayed or wrong-host captcha never reaches Resend", async () => {
  for (const verification of [
    { success: false },
    { success: false, "error-codes": ["timeout-or-duplicate"] },
    { success: true, hostname: "attacker.example" },
    null,
    { success: "true", hostname: "clinic.example" },
  ]) {
    const mock = provider(verification);
    const result = await handleContactRequest(request(), config, mock.fetcher);
    assert.equal(result.status, 400);
    assert.deepEqual(await result.json(), { ok: false, code: "verification" });
    assert.equal(mock.calls.length, 1);
  }
});

test("missing configuration, upstream failure and unconfirmed delivery never report success or expose secrets", async () => {
  const mock = provider();
  for (const key of Object.keys(config)) {
    assert.equal(
      (
        await handleContactRequest(
          request(),
          { ...config, [key]: undefined },
          mock.fetcher,
        )
      ).status,
      503,
    );
  }
  assert.equal(mock.calls.length, 0);
  assert.equal(
    (
      await handleContactRequest(
        new Request("https://clinic.example/api/contact/"),
        config,
        mock.fetcher,
      )
    ).status,
    405,
  );
  for (const status of [429, 500]) {
    const failing = provider(undefined, status);
    const response = await handleContactRequest(
      request(),
      config,
      failing.fetcher,
    );
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { ok: false, code: "failed" });
  }
  const timeout: typeof fetch = async () => {
    throw new DOMException("secret upstream text", "TimeoutError");
  };
  assert.equal(
    (await handleContactRequest(request(), config, timeout)).status,
    502,
  );
  const badJson: typeof fetch = async () =>
    new Response("not JSON", { status: 200 });
  assert.equal(
    (await handleContactRequest(request(), config, badJson)).status,
    502,
  );
  const missingId: typeof fetch = async (input) =>
    Response.json(
      String(input).includes("google.com")
        ? { success: true, hostname: "clinic.example" }
        : {},
    );
  assert.equal(
    (await handleContactRequest(request(), config, missingId)).status,
    502,
  );
});

test("captcha bypass requires development, explicit opt-in and a loopback URL", async () => {
  for (const development of [true, false]) {
    for (const flag of [undefined, "false", "true"]) {
      for (const host of [
        "localhost",
        "127.0.0.1",
        "[::1]",
        "clinic.example",
        "localhost.evil.example",
      ]) {
        assert.equal(
          canBypassRecaptcha(development, flag, new URL(`http://${host}:4321`)),
          development &&
            flag === "true" &&
            ["localhost", "127.0.0.1", "[::1]"].includes(host),
        );
      }
    }
  }
  // A process without Astro's build-time DEV flag cannot bypass verification.
  const mock = provider({ success: false });
  const local = new Request("http://localhost:4321/api/contact/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:4321",
    },
    body: JSON.stringify(submission),
  });
  const result = await handleContactRequest(
    local,
    { ...config, origin: "http://localhost:4321", developmentBypass: "true" },
    mock.fetcher,
  );
  assert.equal(result.status, 400);
  assert.equal(mock.calls.length, 1);
  assert.ok(mock.calls[0].url.includes("google.com"));
});

test("provider failure logs contain safe diagnostic categories, never secrets or enquiry data", async (t) => {
  const logs: unknown[][] = [];
  t.mock.method(console, "error", (...args: unknown[]) => {
    logs.push(args);
  });
  const fetcher: typeof fetch = async (input) =>
    Response.json(
      String(input).includes("google.com")
        ? { success: true, hostname: "clinic.example" }
        : {
            name: "validation_error",
            message: `The private.example domain is not verified. ${config.apiKey} ${submission.email}`,
          },
      { status: String(input).includes("google.com") ? 200 : 403 },
    );
  const result = await handleContactRequest(request(), config, fetcher);
  assert.deepEqual(await result.json(), { ok: false, code: "failed" });
  assert.deepEqual(logs, [
    [
      "[contact] provider failure",
      { provider: "resend", status: 403, code: "sender_domain_not_verified" },
    ],
  ]);
  const unknown: typeof fetch = async (input) =>
    String(input).includes("google.com")
      ? Response.json({ success: true, hostname: "clinic.example" })
      : Response.json(
          { name: config.apiKey, message: submission.message },
          { status: 500 },
        );
  await handleContactRequest(request(), config, unknown);
  assert.ok(!JSON.stringify(logs).includes(config.apiKey));
  assert.ok(!JSON.stringify(logs).includes(submission.email));
});
