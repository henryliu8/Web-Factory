# Rising Tree

Rising Tree Allied Health Services website, migrated from `/Users/henry/Downloads/rising-tree-site`.

Framework: Astro + TypeScript + Tailwind CSS v4. Template: `allied-health`. Theme: `modern-clinical`.

Run from the repository root:

```sh
pnpm wf dev rising-tree
pnpm wf check rising-tree
pnpm wf build rising-tree
pnpm --filter @webfactory/app-rising-tree test:integration
```

## 修改内容与排版

| 修改项目 | 文件 |
| --- | --- |
| Logo、顶部/底部联系方式、导航 | `src/content/site.json` |
| 首页、关于、服务目录、团队目录、联系页 | `src/content/pages/*.json` |
| 服务详情与卡片摘要 | `src/content/services/*.json` |
| 成员详情、照片、列表排序 | `src/content/team/*.json`（`order` 越小越靠前） |
| 图片 | `public/assets/` |
| 单个页面的区块排序 | 对应 JSON 中的 `sections` 数组 |
| 布局变体 | 区块的 `variant`，允许值见模板 `schema.ts` |
| 项目专属颜色、字号等 | `src/styles/project.css`，覆盖语义 token |
| 项目组件替换 | `src/config/overrides.ts`，注册同名 logical key |

列表使用 `collection: "services"` 或 `"team"` 自动读取卡片。添加详情 JSON 后，页面路由和列表自动生成，不需要复制 Astro 页面。文件名与 `slug` 保持一致，服务卡片的 `number` 用于排序。页面内的文案、联系卡片和地点文字是独立编辑字段；`site.json` 修改的是全局页头与页脚。

JSON 中的内容为纯文本；Astro 自动转义，不接受任意 HTML。无效字段会在构建时报错。已有项目级覆盖无需改动模板或共享代码。

## 当前边界

- 联系表单没有后台，不会发信或保存数据。按钮明确显示未发送状态；电话、邮箱链接可以使用。
- 未部署，也未连接 Storyblok。接入方案见 `STORYBLOK.md`。
- 原站 Pexels 图片仍引用远程 URL，本地测试环境对该域名连接超时；上线前确认可访问性及使用权，或替换为项目内图片。Logo 与团队照片已本地化。
- 页面改用目录 URL（例如 `/about-us/`、`/services/psychology/`）。原型 `.html` 深链接不保留；如果已有公开地址，上线时配置对应重定向。
- 团队资历原始说明保留在 `SOURCE-NOTES.md`，尤其 Annie 的两个品牌背景和 Wen 的学位描述，需要内容负责人确认后发布。
