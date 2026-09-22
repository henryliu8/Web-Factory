import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import {
  pageSchema,
  sectionsSchema,
} from "../../../templates/allied-health/src/schema";

const app = fileURLToPath(
  new URL("../../../apps/rising-tree/", import.meta.url),
);
const dist = resolve(app, "dist/client");
assert.ok(
  existsSync(resolve(app, "dist/server/entry.mjs")),
  "Contact API requires a server build",
);
const routes = [
  ...readdirSync(resolve(app, "src/content/pages"))
    .filter((name) => name.endsWith(".json"))
    .map((name) => (name === "home.json" ? "" : name.replace(".json", ""))),
  ...["services", "team"].flatMap((group) =>
    readdirSync(resolve(app, `src/content/${group}`))
      .filter((name) => name.endsWith(".json"))
      .map((name) => `${group}/${name.replace(".json", "")}`),
  ),
];
assert.equal(new Set(routes).size, routes.length, "Routes must be unique");
assert.ok(routes.length > 0, "The project must contain pages");
for (const group of ["pages", "services", "team"]) {
  for (const name of readdirSync(resolve(app, `src/content/${group}`))) {
    if (name.endsWith(".json"))
      pageSchema.parse(
        JSON.parse(
          readFileSync(resolve(app, `src/content/${group}/${name}`), "utf8"),
        ),
      );
  }
}
assert.throws(() =>
  sectionsSchema.parse([
    {
      type: "clinic/FAQ",
      title: "FAQ",
      items: [{ question: "Question", answer: "" }],
    },
  ]),
);
assert.throws(() =>
  sectionsSchema.parse([
    {
      type: "clinic/CTA",
      title: "CTA",
      actions: [{ label: "Unsafe", href: "javascript:alert(1)" }],
    },
  ]),
);
for (const route of routes) {
  const path = resolve(dist, route, "index.html");
  assert.ok(existsSync(path), `Missing route: ${route}`);
  const html = readFileSync(path, "utf8");
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) ?? []).length,
    1,
    `${route}: exactly one H1`,
  );
  assert.ok(
    html.includes('id="main-content"'),
    `${route}: skip-link destination`,
  );
  assert.ok(
    !html.includes("window.RISING_TREE_DATA"),
    `${route}: content must be rendered without browser JavaScript`,
  );
  assert.ok(
    !/data-site-header|data-site-footer|id="servicePage"|id="teamMemberPage"/.test(
      html,
    ),
    `${route}: no old client-rendering mounts`,
  );
  for (const [, raw] of html.matchAll(/(?:href|src)="(\/[^" ]*)"/g)) {
    const [url, hash] = raw.split("#");
    const target = resolve(
      dist,
      url.slice(1).split("?")[0],
      url.endsWith("/") ? "index.html" : "",
    );
    assert.ok(existsSync(target), `${route}: missing local link/asset ${raw}`);
    if (hash && target.endsWith(".html"))
      assert.ok(
        readFileSync(target, "utf8").includes(`id="${hash}"`),
        `${route}: missing anchor ${raw}`,
      );
  }
}
const home = readFileSync(resolve(dist, "index.html"), "utf8");
const submenu = home.match(/<ul class="nav-submenu">([\s\S]*?)<\/ul>/)?.[1];
assert.ok(submenu, "Services navigation must render a submenu");
for (const name of readdirSync(resolve(app, "src/content/services"))) {
  if (!name.endsWith(".json")) continue;
  const service = JSON.parse(
    readFileSync(resolve(app, "src/content/services", name), "utf8"),
  );
  assert.ok(
    submenu.includes(`href="${service.card.href}"`),
    `Missing submenu service: ${service.slug}`,
  );
}

assert.equal(
  (home.match(/class="service-card"/g) ?? []).length,
  readdirSync(resolve(app, "src/content/services")).filter((name) =>
    name.endsWith(".json"),
  ).length,
);
assert.equal(
  (home.match(/class="team-card"/g) ?? []).length,
  readdirSync(resolve(app, "src/content/team")).filter((name) =>
    name.endsWith(".json"),
  ).length,
);
const contact = readFileSync(resolve(dist, "contact/index.html"), "utf8");
assert.ok(contact.includes('action="/api/contact/"'));
assert.ok(contact.includes("data-contact-form"));
assert.ok(
  !/<form[^>]*data-development-bypass/.test(contact),
  "Production form must never bypass captcha",
);
assert.ok(!/<form[^>]*data-demo-form/.test(contact));
for (const field of ["name", "email", "message"]) {
  assert.match(contact, new RegExp(`name="${field}"[^>]*required`));
}
console.log(
  `Rising Tree: ${routes.length} routes, content validation, links, assets, anchors and server-rendered cards passed.`,
);
