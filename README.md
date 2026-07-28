# Apple Health 快捷指令 MCP

把 Apple 健康数据变成 AI 可以只读查看的 3 个工具。

这是一个独立、从零编写的开源小项目。它不依赖付费健康导出 App，也不属于任何聊天软件或角色平台。

## 它像什么？

```text
Apple Watch
    ↓ 自动同步
iPhone 的“健康”
    ↓ 快捷指令抄一份
你自己的 Cloudflare 小仓库
    ↓ 只有拿着 AI 钥匙才能看
支持 HTTP MCP 的 AI
```

AI 只会看到三个工具：

- `health_now`：最近状态、今天活动、最近一晚睡眠。
- `health_detail`：某晚睡眠或某项指标的明细。
- `health_trends`：最近 7、14 或 30 天的变化。

没有“修改健康数据”“删除数据”“远程命令手表”等工具。

## 从哪里开始？

请直接阅读：

- [网页版《从零搭建教程》](GUIDE.zh-CN.md)
- [适合转发和打印的 Word 教程](docs/Apple-Health-快捷指令-MCP-从零搭建教程.docx)

教程从注册 Cloudflare 开始，连每个按钮和要复制的字都写了。

## 项目里的东西

- `src/index.ts`：独立 Worker 与 MCP 代码。
- `schema.sql`：健康数据的小抽屉。
- `wrangler.toml`：Cloudflare 项目设置。
- `scripts/make-keys.mjs`：生成两把私人钥匙。
- `examples/`：不含真人信息的虚构示例。
- `SECURITY.md`：保护隐私的注意事项。

## 开发者自检

```powershell
npm install
npm test
npm run check
```

## 许可证与声明

代码使用 [MIT License](LICENSE)，可学习、修改和分享，但请保留许可证。

本项目只整理用户主动授权上传的数据，不提供医疗诊断，不适合急救。Apple、Apple Health、Apple Watch、iPhone 是其各自权利人的商标，本项目与 Apple 无隶属或背书关系。
