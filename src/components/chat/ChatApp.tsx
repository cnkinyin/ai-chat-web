"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    conversations,
    activeConversation,
    activeId,
    isLoading,
    apiKey,
    setApiKey,
    setActiveId,
    createConversation,
    deleteConversation,
    sendMessage,
  } = useChat();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--main)]">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        onSelect={setActiveId}
        onNew={createConversation}
        onDelete={deleteConversation}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-center border-b border-[var(--border)] px-4">
          <h2 className="truncate text-sm font-medium text-[var(--foreground)]">
            {activeConversation?.title ?? "新对话"}
          </h2>
        </header>

        <MessageList
          messages={activeConversation?.messages ?? []}
          isLoading={isLoading}
        />

        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </main>
    </div>
  );
}
