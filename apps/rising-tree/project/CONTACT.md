# Contact form setup

Rising Tree uses `@webfactory/forms/server` (`verifyRecaptchaV2`, `sendResendEmail`) and `@webfactory/forms/ContactForm.astro`. The project override fills the template's named `form` slot, retaining Project > Theme > Template > Shared. The project API validates the enquiry and checks Google before calling Resend. No Resend SDK or database is required.

## 配置

在 `apps/rising-tree/` 内将 `.env.example` 复制为 `.env`，填写下列变量。不要提交 `.env` 或在聊天中发送密钥。

| 变量 | 用途 |
| --- | --- |
| `PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA **v2 Checkbox** 公开 site key，构建时使用 |
| `RECAPTCHA_SECRET_KEY` | 与 site key 配对的 Google 私钥，仅服务端 |
| `RESEND_API_KEY` | Resend 邮件发送 API key，仅服务端 |
| `CONTACT_FROM_EMAIL` | Resend 已验证域名下的发件邮箱，填写纯邮箱地址 |
| `CONTACT_TO_EMAIL` | 固定收件邮箱；示例为站点提供的诊所邮箱，可修改 |
| `CONTACT_ORIGIN` | 浏览器访问的完整 origin，例如 `https://example.com`，不包含路径 |

1. 在 [Resend](https://resend.com/docs/dashboard/domains/introduction) 添加发件域名，完成提供的 DNS 验证记录，然后创建邮件发送 API key。
2. 在 [Google reCAPTCHA 管理台](https://www.google.com/recaptcha/admin/create) 注册 v2 “I'm not a robot” Checkbox。添加生产域名；本地开发添加 `localhost`。填写配对的 site key 和 secret，保持 Google 的域名验证开启。
3. 本地访问地址与 `CONTACT_ORIGIN` 必须完全一致（协议、主机、端口）。`localhost` 和 `127.0.0.1` 不等价。服务器也会检查 Google 返回的 hostname。
4. 修改公开 site key 后重启开发服务或重新构建。其他变量由 API 在运行时读取，部署环境通过服务端环境变量注入，修改后重启服务。

从仓库根目录运行：

```sh
pnpm wf dev rising-tree
# 配置完成后构建、启动生产服务：
pnpm wf build rising-tree
HOST=127.0.0.1 PORT=4321 pnpm --filter @webfactory/app-rising-tree start
```

生产部署需要 Node.js 22.12+，启动命令会读取 app 目录内的 `.env`（如果存在）；托管平台也可直接注入环境变量。部署时保留完整 `dist/` 和运行依赖，运行 `dist/server/entry.mjs`。`dist/client/` 包含 15 个预生成内容页面，但**仅上传静态文件不能提供邮件 API**。HTTPS 反向代理必须将 `/api/contact/` 转发到 Node 服务。若部署平台是 Cloudflare 或 Vercel，需要换用该平台的 Astro 适配器。

## 本地暂时禁用验证码

在 `apps/rising-tree/.env` 设置：

```dotenv
CONTACT_DISABLE_RECAPTCHA=true
CONTACT_ORIGIN=http://localhost:4321
```

重启 `pnpm wf dev rising-tree`，访问 `http://localhost:4321/contact/`。页面显示本地绕过提示，不加载 Google 验证码。此时 Google 两个 key 可以留空，但 Resend、收发件邮箱配置仍需有效，提交仍会发送真实邮件。测试时将 `CONTACT_TO_EMAIL` 改为自己的测试邮箱。

开关仅在 Astro 开发模式且 URL 主机为 `localhost`、`127.0.0.1` 或 `[::1]` 时生效。开发服务器只绑定本机，不要用公共隧道或代理暴露它。生产构建无论开关值如何都必须通过验证码；请求参数不能启用绕过。恢复时将开关设为 `false`，填回 Google keys 并重启。

完全不发邮件的测试使用 `pnpm --filter @webfactory/app-rising-tree test`，Google 和 Resend 均使用模拟响应。

## Resend 防盗用与防滥用

账号保护、API key 保护和表单防滥用需要分别处理：

- 为每位 Resend 登录用户开启 [MFA](https://resend.com/docs/knowledge-base/how-can-i-add-mfa)。
- Rising Tree 使用独立 key，仅授予 `sending_access`，限定自己的发件域名；开发和生产分开。参见 [权限与域名范围](https://resend.com/docs/api-reference/api-keys/create-api-key)。域名范围不限制收件人，泄漏的发送 key 仍能被用于外发邮件。
- key 只存在服务端环境变量或部署平台 secret 中，不使用 `PUBLIC_`，不放入仓库、前端、日志、截图或聊天。已知泄漏应立即撤销，创建新 key，并检查发送日志。参见 [官方密钥安全指南](https://resend.com/docs/knowledge-base/how-to-handle-api-keys)。
- 当前接口固定收件人，访客不能设置 `to`、`cc`、`bcc`；只允许设置回复地址。验证码、hostname 校验、请求校验和 honeypot 已实现，但攻击者仍可能刷诊所收件箱并消耗额度。
- **尚未实现**每 IP 限流、全站发送上限和自动告警。上线时应在可信反向代理/托管平台配置接口限流，并增加发送总量上限与异常告警；多实例必须共享计数。可先按每 IP 每 10 分钟 5 次、全站每天 100 封作为待调整的业务策略，并返回 429。
- Origin 检查只能辅助阻止浏览器跨站提交，脚本可伪造它；验证码和幂等键也不能替代限流。如果 key 本身泄漏，攻击者能直接调用 Resend，绕过网站的全部防护。

## 行为与维护

- `src/content/pages/contact.json` 管理标签、提示、服务选项和发送反馈。`src/server/contact.ts` 管理字段校验、固定收发件人和邮件文本。
- `/api/contact/` 仅接受同 origin 的 JSON POST。姓名、邮箱和 10–5,000 字符留言必填；请求大小上限 32 KiB，另有 honeypot。私钥只在服务端使用，不进入页面。
- 验证码须通过 Google 服务端检查，且 hostname 必须匹配配置。验证码失效、重复使用、异常或校验服务失败时均不会发信。详情见 [Google 验证协议](https://developers.google.com/recaptcha/docs/verify)。
- 收件人由服务端固定，访客邮箱仅作为 `Reply-To`。邮件为纯文本。失败保留输入，重新验证后可重试；未修改的重试沿用 Resend idempotency key，避免网络异常引起的重复发送。参见 [Resend 邮件 API](https://resend.com/docs/api-reference/emails/send-email)。
- 成功提示表示 Resend 已接受邮件，并不确认收件箱投递。投递或退信状态在 Resend 控制台查看。没有实现数据库留存、自动回复或投递 webhook。
- 缺少公开 key 时按钮禁用并提示暂不可用；服务端缺配置返回 503，不会假报成功。无 JavaScript 时显示电话/邮箱替代提示。
- 如需按 IP 限流，使用部署平台或反向代理的限流功能；当前没有应用内分布式限流器。

## 验证

```sh
pnpm --filter @webfactory/app-rising-tree test:integration
pnpm --filter @webfactory/forms check
pnpm wf check rising-tree
pnpm test:integration
```

接口测试使用模拟 Google/Resend 响应，不会发出邮件。覆盖有效请求、非法输入、跨来源请求、大小限制、验证码失败/过期/重复/域名不符、配置缺失和服务异常。

上线前用真实配置人工完成一次验证码并提交测试询问，检查诊所收件箱及 Reply-To。当前未配置真实凭据，真实验证码和邮件投递尚未验证。


## 发送失败排查

页面显示 “We could not confirm submission” 时，查看运行 Astro 的终端或生产服务日志中的 `[contact] provider failure`。日志只包含服务名、HTTP 状态和受控错误类别，不记录密钥、邮箱、留言或服务商原始响应。

- `resend / 403 / sender_domain_not_verified`：在 Resend 验证 `CONTACT_FROM_EMAIL` 的域名，并核对是否使用了已验证的子域名。
- `testing_recipient_restricted`：仍受测试收件人限制，需要验证发件域名或按 Resend 提示使用账号所有者邮箱测试。
- `restricted_api_key`、`invalid_permission`、`invalid_api_key`：检查 key 是否有效、启用且允许当前发件域名。发送专用 key 不能列出域名，这本身不是发信失败。
- `rate_limit_exceeded` 或 quota 类别：检查调用频率及发送额度。
- `timeout`、`network_or_invalid_response`：检查服务器网络、代理和服务状态；不能据此确认邮件是否已被接受。
- 其他类别：打开 Resend → Logs 对照失败请求的详细原因。不要将原始服务商错误返回给公开页面。
