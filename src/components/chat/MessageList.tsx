"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
          <span className="text-2xl">✦</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          今天想聊些什么？
        </h2>
        <p className="mt-3 max-w-md text-sm text-[var(--muted)]">
          在下方输入你的问题，开始一段智能对话。支持多轮上下文（演示模式）。
        </p>
        <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          {[
            "帮我写一段产品介绍文案",
            "解释 React 与 Next.js 的区别",
            "制定一周学习计划",
            "推荐几本技术书籍",
          ].map((hint) => (
            <div
              key={hint}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left text-sm text-[var(--muted)]"
            >
              {hint}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-3xl">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex gap-4 bg-[var(--message-assistant)] px-4 py-6 md:px-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="flex items-center gap-2 pt-1 text-sm text-[var(--muted)]">
              正在思考
              <span className="typing-dots">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
