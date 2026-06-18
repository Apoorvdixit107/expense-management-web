"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useOrganization } from "@/components/OrganizationProvider";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "How is my spending this month?",
  "Which category should I cut back on?",
  "Tips to save more money",
  "Explain my current balance",
];

export function AssistantChat() {
  const { currentOrg, currentOrgId } = useOrganization();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm ExpenseKit AI. Ask me about your spending, balance, categories, or budgeting — I use your organization's data to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !currentOrgId || sending) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const history = nextMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(0, -1)
        .slice(-10);

      const result = await api.assistantChat({
        organizationId: currentOrgId,
        message: trimmed,
        history,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
      if (result.mock) {
        toast.info("Demo AI mode — add GEMINI_API_KEY on backend for full answers.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to get AI reply");
      setMessages((prev) => prev.slice(0, -1));
      setInput(trimmed);
    } finally {
      setSending(false);
    }
  }

  if (!currentOrg) {
    return (
      <Card>
        <p className="text-sm text-muted">Select an organization to chat with ExpenseKit AI.</p>
      </Card>
    );
  }

  return (
    <Card className="flex h-[min(70vh,640px)] flex-col overflow-hidden p-0">
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-ink">Chatting about {currentOrg.name}</p>
        <p className="text-xs text-muted">Answers use your live balance and recent transactions.</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-brand text-white"
                  : "border border-border bg-paper text-ink"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {sending ? (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-border bg-paper px-4 py-3 text-sm text-muted">
              Thinking...
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 ? (
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3 sm:px-5">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void sendMessage(suggestion)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:border-brand hover:text-brand"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
        className="flex gap-2 border-t border-border p-4 sm:p-5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about spending, savings, or your balance..."
          disabled={sending}
          className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
        />
        <Button type="submit" disabled={sending || !input.trim()}>
          {sending ? "..." : "Send"}
        </Button>
      </form>
    </Card>
  );
}
