# AI Chat Web

现代化 AI 聊天网站 — 基于 Next.js + React + Tailwind CSS 构建，支持深色主题，界面风格类似 ChatGPT。

![项目预览](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=flat-square&logo=tailwindcss)

## 功能特性

- 💬 **对话管理** - 支持新建、切换、删除对话
- 🎨 **深色主题** - 精心设计的深色用户界面
- ⌨️ **快捷键** - Enter 发送消息，Shift+Enter 换行
- 🤖 **多模型支持** - 支持 OpenAI GPT 和 Google Gemini 自由切换
- 🔑 **API Key 配置** - 支持配置多个 AI 提供商的 API Key
- 🎭 **演示模式** - 无需配置 API Key，即可体验聊天功能
- 📱 **响应式设计** - 适配不同尺寸的屏幕

## 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm（随 Node.js 一起安装）

### 安装步骤

```bash
# 克隆项目（如果需要）
git clone https://github.com/cnkinyin/ai-chat-web.git
cd ai-chat-web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可使用。

### 生产部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 使用指南

### 演示模式

项目默认运行在演示模式下，无需配置任何 API。可以体验基本的聊天界面和功能。

### 接入 AI API

支持 **OpenAI** 和 **Google Gemini** 两种 AI 模型：

#### OpenAI 配置

1. 获取 OpenAI API Key（访问 [OpenAI 官网](https://platform.openai.com/api-keys)）
2. 在应用左侧底部的模型选择器中选择 **"OpenAI (GPT-3.5)"**
3. 在 **API Key** 输入框中粘贴你的 Key（格式：`sk-...`）
4. 系统会自动切换到真实 AI 对话模式

#### Google Gemini 配置

1. 获取 Google Gemini API Key（访问 [Google AI Studio](https://makersuite.google.com/app/apikey)）
2. 在应用左侧底部的模型选择器中选择 **"Google Gemini"**
3. 在 **API Key** 输入框中粘贴你的 Key（格式：`AIza...`）
4. 系统会自动切换到 Gemini AI 对话模式

### 对话操作

- **新建对话**：点击左侧 "新建对话" 按钮
- **切换对话**：点击左侧对话列表中的任意对话
- **删除对话**：悬停对话，点击右侧出现的删除按钮

## 项目结构

```
ai-chat-web/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx        # 主页面
│   │   ├── layout.tsx      # 布局组件
│   │   └── globals.css     # 全局样式
│   ├── components/chat/    # 聊天相关组件
│   │   ├── ChatApp.tsx    # 主应用组件
│   │   ├── ChatInput.tsx   # 消息输入框
│   │   ├── Sidebar.tsx     # 侧边栏（对话列表 + API 配置）
│   │   ├── MessageList.tsx # 消息列表
│   │   └── MessageBubble.tsx # 消息气泡
│   ├── hooks/
│   │   └── useChat.ts      # 聊天状态管理
│   ├── lib/
│   │   └── id.ts           # ID 生成工具
│   └── types/
│       └── chat.ts         # TypeScript 类型定义
├── public/                 # 静态资源
├── package.json           # 项目配置
└── tsconfig.json         # TypeScript 配置
```

## 技术栈

- **框架**：Next.js 16 (App Router)
- **UI 库**：React 19
- **样式**：Tailwind CSS 4
- **图标**：Lucide React
- **语言**：TypeScript 5

## API 配置说明

应用支持通过 OpenAI 和 Google Gemini API 进行真实的 AI 对话。核心代码位于 `src/hooks/useChat.ts`：

### OpenAI API 调用

```typescript
async function callOpenAI(apiKey: string, messages: Message[]) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "API 请求失败");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### Google Gemini API 调用

```typescript
async function callGemini(apiKey: string, messages: Message[]) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

如需添加更多 AI 提供商（如 Anthropic Claude 等），可以在 `src/hooks/useChat.ts` 中添加相应的调用函数。

## License

MIT License - 欢迎使用和贡献！

## 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 漂亮的图标
- [OpenAI](https://openai.com/) - GPT 模型支持
- [Google](https://deepmind.google/gemini) - Gemini 模型支持
