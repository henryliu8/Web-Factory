# Storyblok 与 Web Factory

可以使用。Storyblok 是内容来源与可视化编辑器；Web Factory 继续负责模板、主题、组件解析与构建。本次完成可独立使用的本地内容迁移和接入设计，**没有安装 Storyblok SDK、创建 Space 或启用在线编辑**。

## 建议模型

| Storyblok 内容 | 当前项目 |
| --- | --- |
| `site_settings` | `site.json` 的品牌、导航、联系方式 |
| `page`，包含有序 `body` blocks | 页面 JSON 的 `sections` |
| `service` | 服务详情及目录卡片 |
| `team_member` | 人员详情、照片、排序及目录卡片 |
| `hero`, `card_grid`, `split`, `faq`, `cta` 等 nestable blocks | `clinic/Hero` 等模板 logical keys |

可视化编辑可覆盖文案、图片、按钮、卡片条目、区块增删排序与预设 `variant`。任意 CSS、全新布局和业务交互仍由开发实现。只开放已经验证的变体，避免编辑器破坏移动端排版。

## 接入顺序（尚未实施）

1. 确认 Space、数据区域、访问 token 和预览域名。在 Rising Tree 应用内安装与当前 Astro 版本兼容的官方 `@storyblok/astro`，不要把 CMS SDK 强制加入所有共享包。
2. 创建上表的内容类型，把本地 JSON 导入为 stories/assets。内容负责人确认图片与临床介绍。迁移期间选择一个内容来源，不默默混合远程失败与本地旧稿。
3. 在项目内添加适配器，将 Storyblok `component` 映射为模板 logical `type`，将 asset/link/rich-text 等字段转换为当前 schema，并经过 Zod 校验。保留 `_uid` 与 `_editable` 以供编辑定位；当前纯文本组件不直接渲染富文本 HTML。
4. 预览包装组件通过 `storyblokEditable` 标记实际区块，使用官方 Bridge/live-preview 流程；内容仍交给 Web Factory registry/PageBuilder 解析。不能仅添加 SDK 后就认为可视化编辑已经完成。
5. 配置 HTTPS 预览环境和草稿读取。选择服务器预览时增加对应部署适配器，并保留 preview-only 边界；仅使用静态正式构建不会自动获得实时草稿预览。
6. 正式站读取 published 内容，发布 webhook 触发重新构建。预览 token 不写入 Git，不与公开生产页面混用。测试草稿编辑、区块排序、图片替换、发布更新和取消发布。

接入后依旧是 **Project > Theme > Template > Shared**。CMS 只替换内容读取及预览适配层，不生成另一套重复组件。

## 官方资料

- [Astro 集成指南](https://www.storyblok.com/docs/guides/astro)
- [Astro Visual Preview（HTTPS 与可编辑标记）](https://www.storyblok.com/docs/guides/astro/visual-preview)
- [Astro SDK 参考](https://www.storyblok.com/docs/libraries/js/astro-sdk)

已核对官方文档（2026-09-22）。实现时应核对目标 SDK 的 peer dependencies；不依据指南中的历史版本示例直接升级整个 monorepo。
