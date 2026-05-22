"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-[var(--border)] bg-[var(--main)] px-4 pb-6 pt-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] shadow-lg shadow-black/20 transition-colors focus-within:border-[var(--border-focus)]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="发送消息… (Enter 发送，Shift+Enter 换行)"
            rows={1}
            disabled={disabled}
            className="w-full resize-none bg-transparent px-4 py-4 pr-24 text-[15px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none disabled:opacity-50"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-1">
            <button
              type="button"
              className="icon-btn opacity-50"
              aria-label="附件（演示）"
              disabled
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="send-btn"
              aria-label="发送"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
          AI 可能会犯错，请核实重要信息。
        </p>
      </div>
    </div>
  );
}
