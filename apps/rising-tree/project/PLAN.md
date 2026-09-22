# Migration status

Completed: source inventory; template and semantic-token theme; ten reusable section types; content extraction; 15 static pages; automatic service/team cards; local identity assets; core optional schema extension with regression test; generic CLI scaffold; maintenance and CMS documentation.

Checks: template/theme/app type checks; Rising Tree build and route/content/link integration check; generic CLI create/check/build smoke; existing root integration gate. Browser QA passed for all 15 routes at 1440, 768 and 390 pixels with no horizontal overflow. Service navigation, FAQ expansion, mobile menu and the unsent form message passed; no JavaScript page errors were observed. Remote Pexels requests timed out, so remote photo rendering is not verified; the all-route layout sweep blocked those failing requests.

Separate future work: approve final clinical copy, provide production domain, configure provider credentials and verify live enquiry delivery, replace or verify remote stock imagery, optionally configure a Storyblok space and preview hosting. No Storyblok credentials or deployment have been configured.

Contact delivery: shared Resend/reCAPTCHA v2 integrations, project API and Node standalone adapter implemented. Contact API tests, 15-route build validation, forms/template/app type checks and root integration gate passed. Playwright at 1440px and 390px verified mock captcha gating/expiry, retained input after failure, retry idempotency and cleared input after success; no page errors or horizontal overflow. The built server returns 503 without credentials. Live Google verification and actual email delivery await provider configuration.
