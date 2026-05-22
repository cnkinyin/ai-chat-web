"use client";

import { Bot, User } from "lucide-react";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-4 px-4 py-6 md:px-0 ${
        isUser ? "" : "bg-[var(--message-assistant)]"
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser
            ? "bg-[var(--surface)] text-[var(--foreground)]"
            : "bg-[var(--accent)]/15 text-[var(--accent)]"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1 pt-0.5">
        <p className="text-xs font-medium text-[var(--muted)]">
          {isUser ? "你" : "AI 助手"}
        </p>
        <div className="prose-chat text-[15px] leading-relaxed text-[var(--foreground)]">
          {message.content.split("\n").map((line, i) => (
            <p key={i} className={i > 0 ? "mt-3" : ""}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
