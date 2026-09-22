import { z } from "zod";
import {
  FormProviderError,
  sendResendEmail,
  verifyRecaptchaV2,
} from "@webfactory/forms/server";
import { canBypassRecaptcha } from "../config/contactDevelopment";
import contactPage from "../content/pages/contact.json";

const serviceOptions = contactPage.sections
  .find((section) => section.type === "clinic/Contact")!
  .form!.fields.find((field) => field.name === "service")!.options!;
const singleLine = z
  .string()
  .trim()
  .regex(/^[^\x00-\x1f\x7f]*$/);
const submissionSchema = z
  .object({
    name: singleLine.min(1).max(100),
    email: singleLine.email().max(254),
    phone: singleLine
      .max(40)
      .regex(/^[\d+(). -]*$/)
      .default(""),
    service: z.string().refine((value) => serviceOptions.includes(value)),
    message: z.string().trim().min(10).max(5000),
    website: z.literal("").default(""),
    captchaToken: z.string().min(1).max(4096),
    submissionId: z.string().uuid(),
  })
  .strict();
const configSchema = z.object({
  apiKey: z.string().trim().min(1),
  from: singleLine.email(),
  to: singleLine.email(),
  recaptchaSecret: z.string().trim().min(1),
  origin: z
    .string()
    .url()
    .refine((value) => {
      const url = new URL(value);
      return (
        ["http:", "https:"].includes(url.protocol) &&
        url.pathname === "/" &&
        !url.search &&
        !url.hash &&
        !url.username &&
        !url.password
      );
    })
    .transform((value) => new URL(value).origin),
});
export type ContactConfig = Partial<
  Record<keyof z.infer<typeof configSchema>, string>
> & { developmentBypass?: string };

const reply = (status: number, code: string) =>
  new Response(JSON.stringify({ ok: status === 200, code }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(status === 405 ? { Allow: "POST" } : {}),
    },
  });

export async function handleContactRequest(
  request: Request,
  input: ContactConfig,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST") return reply(405, "method");
  const bypass = canBypassRecaptcha(
    import.meta.env?.DEV === true,
    input.developmentBypass,
    new URL(request.url),
  );
  const config = configSchema.safeParse({
    ...input,
    recaptchaSecret: bypass ? "development-only" : input.recaptchaSecret,
  });
  if (!config.success) return reply(503, "unavailable");
  const settings = config.data;
  if (request.headers.get("origin") !== settings.origin)
    return reply(403, "origin");
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return reply(415, "invalid");
  const maxBytes = 32_768;
  if (Number(request.headers.get("content-length")) > maxBytes)
    return reply(413, "invalid");
  let raw: unknown;
  try {
    // Bound streamed bodies too: Content-Length is not trustworthy or always present.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, "invalid");
    const decoder = new TextDecoder();
    let text = "";
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        return reply(413, "invalid");
      }
      text += decoder.decode(value, { stream: true });
    }
    raw = JSON.parse(text + decoder.decode());
  } catch {
    return reply(400, "invalid");
  }
  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) return reply(400, "invalid");
  const data = parsed.data;
  let stage = "recaptcha";
  try {
    const verified =
      bypass ||
      (await verifyRecaptchaV2(
        {
          secret: settings.recaptchaSecret,
          token: data.captchaToken,
          hostname: new URL(settings.origin).hostname,
        },
        fetcher,
      ));
    if (!verified) return reply(400, "verification");
    stage = "resend";
    await sendResendEmail(
      {
        apiKey: settings.apiKey,
        from: settings.from,
        to: settings.to,
        replyTo: data.email,
        subject: `Website enquiry — ${data.service}`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone || "Not supplied"}`,
          `Service: ${data.service}`,
          "",
          data.message,
        ].join("\n"),
        idempotencyKey: `contact/${data.submissionId}`,
      },
      fetcher,
    );
    return reply(200, "success");
  } catch (error) {
    // Log only controlled categories, never error.message/cause or submitted data.
    console.error("[contact] provider failure", {
      provider: error instanceof FormProviderError ? error.provider : stage,
      status: error instanceof FormProviderError ? error.status : undefined,
      code:
        error instanceof FormProviderError
          ? error.code
          : error instanceof Error && error.name === "TimeoutError"
            ? "timeout"
            : "network_or_invalid_response",
    });
    return reply(502, "failed");
  }
}
