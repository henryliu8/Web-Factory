import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { handleContactRequest } from "../../server/contact";

export const prerender = false;
export const ALL: APIRoute = ({ request }) =>
  handleContactRequest(request, {
    developmentBypass: getSecret("CONTACT_DISABLE_RECAPTCHA"),
    apiKey: getSecret("RESEND_API_KEY"),
    from: getSecret("CONTACT_FROM_EMAIL"),
    to: getSecret("CONTACT_TO_EMAIL"),
    recaptchaSecret: getSecret("RECAPTCHA_SECRET_KEY"),
    origin: getSecret("CONTACT_ORIGIN"),
  });
