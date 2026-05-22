"use client";

import { useCallback, useState } from "react";
import type { Conversation, Message } from "@/types/chat";
import { createId } from "@/lib/id";

// 模型类型
export type AIModel = "openai" | "gemini";

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "demo-1",
    title: "欢迎对话",
    updatedAt: Date.now(),
    messages: [
      {
        id: "m-1",
        role: "assistant",
        content:
          "你好！我是你的 AI 助手。你可以问我任何问题，我会尽力帮助你。",
        createdAt: Date.now(),
      },
    ],
  },
  {
    id: "demo-2",
    title: "项目规划建议",
    updatedAt: Date.now() - 86400000,
    messages: [
      {
        id: "m-2",
        role: "user",
        content: "如何规划一个现代化的 Web 应用？",
        createdAt: Date.now() - 86400000,
      },
      {
        id: "m-3",
        role: "assistant",
        content:
          "建议从用户需求出发，选择合适的技术栈，采用组件化架构，并注重可访问性与性能优化。",
        createdAt: Date.now() - 86300000,
      },
    ],
  },
];

function deriveTitle(messages: Message[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "新对话";
  const text = firstUser.content.trim();
  return text.length > 24 ? `${text.slice(0, 24)}…` : text;
}

function mockAssistantReply(userMessage: string, model: AIModel): string {
  const trimmed = userMessage.trim();
  if (!trimmed) {
    return "请告诉我你想聊些什么，我很乐意帮忙。";
  }
  const modelName = model === "gemini" ? "Gemini" : "OpenAI";
  return `感谢你的提问。关于「${trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed}」，这是一个很好的话题。\n\n目前这是演示模式，尚未连接真实 AI API。配置 ${modelName} API Key 后，这里会显示真实的智能回复。`;
}

// OpenAI API 调用
async function callOpenAI(apiKey: string, messages: Message[]): Promise<string> {
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

// Google Gemini API 调用
async function callGemini(apiKey: string, messages: Message[]): Promise<string> {
  // 转换消息格式
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "API 请求失败");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// 根据模型调用对应的 API
async function callAI(
  apiKey: string,
  model: AIModel,
  messages: Message[]
): Promise<string> {
  if (model === "gemini") {
    return callGemini(apiKey, messages);
  }
  return callOpenAI(apiKey, messages);
}

export function useChat() {
  const [conversations, setConversations] =
    useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState(INITIAL_CONVERSATIONS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [aiModel, setAiModel] = useState<AIModel>("openai");

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? conversations[0];

  const createConversation = useCallback(() => {
    const newConv: Conversation = {
      id: createId(),
      title: "新对话",
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    return newConv.id;
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (next.length === 0) {
          const fresh: Conversation = {
            id: createId(),
            title: "新对话",
            messages: [],
            updatedAt: Date.now(),
          };
          setActiveId(fresh.id);
          return [fresh];
        }
        if (id === activeId) {
          setActiveId(next[0].id);
        }
        return next;
      });
    },
    [activeId],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = {
        id: createId(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const messages = [...c.messages, userMessage];
          return {
            ...c,
            messages,
            title: deriveTitle(messages),
            updatedAt: Date.now(),
          };
        }),
      );

      setIsLoading(true);

      let replyContent: string;

      if (apiKey) {
        try {
          const currentConv = conversations.find((c) => c.id === activeId);
          const allMessages = currentConv?.messages || [];
          replyContent = await callAI(apiKey, aiModel, [
            ...allMessages,
            userMessage,
          ]);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "未知错误";
          const cleanError = errorMsg.replace(/https?:\/\/[^\s]+/g, "").trim();
          replyContent = `API 调用失败: ${cleanError}\n\n将使用演示模式回复：\n${mockAssistantReply(trimmed, aiModel)}`;
        }
      } else {
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
        replyContent = mockAssistantReply(trimmed, aiModel);
      }

      const assistantMessage: Message = {
        id: createId(),
        role: "assistant",
        content: replyContent,
        createdAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const messages = [...c.messages, assistantMessage];
          return {
            ...c,
            messages,
            updatedAt: Date.now(),
          };
        }),
      );

      setIsLoading(false);
    },
    [activeId, isLoading, apiKey, aiModel, conversations],
  );

  return {
    conversations,
    activeConversation,
    activeId,
    isLoading,
    apiKey,
    aiModel,
    setApiKey,
    setAiModel,
    setActiveId,
    createConversation,
    deleteConversation,
    sendMessage,
  };
}
