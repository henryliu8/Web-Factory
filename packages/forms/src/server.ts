/** Safe diagnostic metadata only; never attach provider bodies or request contents. */
export class FormProviderError extends Error {
  constructor(
    public readonly provider: "recaptcha" | "resend",
    public readonly status: number,
    public readonly code: string,
  ) {
    super(`${provider}: ${code} (HTTP ${status})`);
  }
}

/** Server-only integrations. Callers own credentials, input validation and recipients. */
export async function verifyRecaptchaV2(
  options: { secret: string; token: string; hostname: string },
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const response = await fetcher(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret: options.secret,
        response: options.token,
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok)
    throw new FormProviderError("recaptcha", response.status, "http_error");
  const result = await response.json();
  return result?.success === true && result.hostname === options.hostname;
}

export async function sendResendEmail(
  options: {
    apiKey: string;
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
    idempotencyKey: string;
  },
  fetcher: typeof fetch = fetch,
): Promise<string> {
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": options.idempotencyKey,
    },
    body: JSON.stringify({
      from: options.from,
      to: [options.to],
      reply_to: options.replyTo,
      subject: options.subject,
      text: options.text,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  // Never expose provider responses: they may contain configuration or personal data.
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const knownCodes = [
      "validation_error",
      "missing_api_key",
      "invalid_api_key",
      "restricted_api_key",
      "suspended_api_key",
      "invalid_permission",
      "rate_limit_exceeded",
      "daily_quota_exceeded",
      "monthly_quota_exceeded",
      "invalid_idempotency_key",
      "invalid_idempotent_request",
      "concurrent_idempotent_requests",
      "application_error",
      "service_unavailable",
    ];
    let code = knownCodes.includes(body?.name) ? body.name : "http_error";
    if (body?.name === "validation_error" && typeof body.message === "string") {
      if (/domain is not verified/i.test(body.message))
        code = "sender_domain_not_verified";
      else if (/only send testing emails to your own email/i.test(body.message))
        code = "testing_recipient_restricted";
    }
    throw new FormProviderError("resend", response.status, code);
  }
  const result = await response.json();
  if (typeof result?.id !== "string" || !result.id)
    throw new FormProviderError(
      "resend",
      response.status,
      "acceptance_not_confirmed",
    );
  return result.id;
}
