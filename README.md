# AI Chat Web

现代化 AI 聊天网站 — Next.js + React + Tailwind CSS，深色主题，类 ChatGPT 界面。

## 功能

- 左侧对话列表（新建、切换、删除）
- 中间聊天消息区（用户 / AI 气泡）
- 底部输入框（Enter 发送，Shift+Enter 换行）
- 演示模式模拟 AI 回复（可后续接入真实 API）

## 环境要求

- Node.js 18.17 或更高版本
- npm（随 Node.js 安装）

## 运行步骤

### 1. 进入项目目录

```bash
cd d:\AIProjects\ai-chat-web
```

### 2. 安装依赖（首次运行必须执行）

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可使用。

### 4. 生产构建（可选）

```bash
npm run build
npm start
```

生产环境默认端口为 3000，访问 [http://localhosth:3000](http://localhost:3000)。

## 项目结构

```
src/
├── app/              # Next.js App Router 页面与全局样式
├── components/chat/  # 聊天 UI 组件
├── hooks/            # useChat 状态逻辑
├── lib/              # 工具函数
└── types/            # TypeScript 类型
```

## 后续扩展

在 `src/hooks/useChat.ts` 的 `sendMessage` 中，将 `mockAssistantReply` 替换为对 OpenAI / Anthropic 等 API 的调用即可接入真实 AI。
