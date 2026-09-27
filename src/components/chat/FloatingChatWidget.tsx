import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  X,
  Maximize2,
  Trash2,
  MessageSquare,
  HelpCircle,
  Briefcase,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      text: "👋 Hi! Need help navigating SpamShield or preparing security advice for a client? Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If already on the dedicated /advisor page, we can hide or minimize the floating widget
  const isAdvisorPage = location.pathname === "/advisor";

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const history = nextMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, model: "gemini-2.5-flash" }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: data.reply,
          },
        ]);
      } else {
        throw new Error(data.error || "No reply");
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "I am ready to help! To use SpamShield, check the Live Dashboard or scan numbers in the Number Checker.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (isAdvisorPage) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold rounded-full shadow-2xl shadow-emerald-500/30 transition-all transform hover:scale-105 group border border-emerald-300/40 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full" />
          </div>
          <span className="text-sm tracking-wide">AI Assistant</span>
          <span className="bg-black/20 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
            Online
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-[#0F1115] border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-100 dark:bg-zinc-900/90 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    SpamShield AI
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400">Platform Guide & Client Advisor</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                to="/advisor"
                onClick={() => setIsOpen(false)}
                title="Open Full Screen AI Advisor"
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setMessages([{ id: "reset", role: "assistant", text: "Chat history cleared. How can I help you today?" }])}
                title="Clear Chat"
                className="p-1.5 text-slate-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick chips if few messages */}
          {messages.length <= 2 && (
            <div className="px-3 pt-3 pb-1 bg-slate-50 dark:bg-zinc-950/60 border-b border-slate-200 dark:border-zinc-800/60 flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSend("How to use SpamShield?")}
                className="text-[11px] bg-white dark:bg-zinc-900 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-slate-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300 px-2 py-1 rounded-md border border-slate-200 dark:border-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                How to use?
              </button>
              <button
                onClick={() => handleSend("What advice should I give our business client whose OTP is attacked?")}
                className="text-[11px] bg-white dark:bg-zinc-900 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-slate-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300 px-2 py-1 rounded-md border border-slate-200 dark:border-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Briefcase className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Client Advisory
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50/50 dark:bg-transparent">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                      isUser
                        ? "bg-emerald-600 text-white rounded-br-none shadow-sm"
                        : "bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-bl-none shadow-xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2 items-center text-slate-500 dark:text-zinc-400 text-xs">
                <div className="w-6 h-6 rounded bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                </div>
                <span>SpamShield AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask how to use or how to advise clients..."
                disabled={loading}
                className="flex-1 bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-black rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-500 mt-1.5 px-1">
              <span>Powered by Gemini</span>
              <Link to="/advisor" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                Open Full Screen &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
