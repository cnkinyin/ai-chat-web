"use client";

import { useState } from "react";
import {
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeft,
  Trash2,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Conversation } from "@/types/chat";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return new Date(timestamp).toLocaleDateString("zh-CN");
}

export function Sidebar({
  conversations,
  activeId,
  collapsed,
  onToggleCollapse,
  onSelect,
  onNew,
  onDelete,
  apiKey,
  onApiKeyChange,
}: SidebarProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  if (collapsed) {
    return (
      <aside className="flex w-14 shrink-0 flex-col items-center gap-3 border-r border-[var(--border)] bg-[var(--sidebar)] py-4">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="icon-btn"
          aria-label="展开侧边栏"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onNew}
          className="icon-btn"
          aria-label="新建对话"
        >
          <MessageSquarePlus className="h-5 w-5" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--sidebar)]">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-[var(--foreground)]">
            AI Chat
          </h1>
          <p className="text-xs text-[var(--muted)]">智能对话助手</p>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="icon-btn"
          aria-label="收起侧边栏"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      <div className="px-3 pb-2">
        <button type="button" onClick={onNew} className="new-chat-btn">
          <MessageSquarePlus className="h-4 w-4" />
          新建对话
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
          历史记录
        </p>
        <ul className="space-y-0.5">
          {conversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <li key={conv.id}>
                <div
                  className={`group flex items-center gap-1 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[var(--surface-hover)]"
                      : "hover:bg-[var(--surface)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(conv.id)}
                    className="min-w-0 flex-1 px-3 py-2.5 text-left"
                  >
                    <span
                      className={`block truncate text-sm ${
                        isActive
                          ? "font-medium text-[var(--foreground)]"
                          : "text-[var(--foreground)]/90"
                      }`}
                    >
                      {conv.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[var(--muted)]">
                      {formatRelativeTime(conv.updatedAt)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="mr-2 rounded-md p-1.5 text-[var(--muted)] opacity-0 transition-opacity hover:bg-[var(--surface-hover)] hover:text-red-400 group-hover:opacity-100"
                    aria-label={`删除 ${conv.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--border)] px-4 py-3">
        <div className="mb-2">
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
            API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-focus)] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-7 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
              aria-label={showApiKey ? "隐藏 API Key" : "显示 API Key"}
            >
              {showApiKey ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
            {apiKey && (
              <div
                className={`absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full ${
                  apiKey.startsWith("sk-")
                    ? "bg-[var(--accent)]"
                    : "bg-yellow-500"
                }`}
                title={apiKey.startsWith("sk-") ? "格式正确" : "格式可能不正确"}
              />
            )}
          </div>
        </div>
        <p className="text-[11px] text-[var(--muted)]">
          {apiKey
            ? apiKey.startsWith("sk-")
              ? "API Key 已配置"
              : "API Key 格式不正确"
            : "演示模式 · 未连接 API"}
        </p>
      </div>
    </aside>
  );
}
