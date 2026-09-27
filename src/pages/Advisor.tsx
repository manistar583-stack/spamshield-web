import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Info,
  RefreshCw,
  PhoneCall,
  Search,
  Lock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  source?: string;
}

const QUICK_PROMPTS = [
  {
    category: "Platform Guide",
    icon: HelpCircle,
    label: "How to use SpamShield?",
    prompt: "Can you give me a step-by-step guide on how to use all the tools in SpamShield?",
  },
  {
    category: "Client Advisory",
    icon: Briefcase,
    label: "How to discuss with clients whose OTP is attacked?",
    prompt: "What advice should I give our business client whose OTP signup system is flooded by SMS bombers?",
  },
  {
    category: "Number Check",
    icon: Search,
    label: "How to evaluate a suspicious caller?",
    prompt: "How does the Number Checker compute risk scores and identify carrier spoofing?",
  },
  {
    category: "Client Pitch",
    icon: Sparkles,
    label: "Pitch SpamShield to an Enterprise Client",
    prompt: "Provide an executive pitch and ROI explanation for SpamShield protection for an enterprise client.",
  },
  {
    category: "Personal Protection",
    icon: Lock,
    label: "How does VIP Number Whitelisting work?",
    prompt: "How do I configure Personal Protection to safeguard VIP client and executive numbers?",
  },
];

export function Advisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      text: `### 👋 Welcome to SpamShield AI Advisor!

I am your cyber-defense intelligence agent. You can ask me:
1. **How to use SpamShield**: Guided walkthroughs of the Real-time Dashboard, Number Checker, Bomber Detector, and Personal Protection.
2. **Client Consultation**: Actionable guidance, technical counter-measures, and boardroom talking points to discuss with clients facing SMS bombing, toll fraud, or robocall harassment.

Select a quick topic below or type your question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "SpamShield-AI",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<"gemini-2.5-flash" | "gemini-2.5-pro">("gemini-2.5-flash");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Prepare backend payload
      const historyPayload = newMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          model: selectedModel,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            source: data.model || "Gemini AI",
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to generate answer");
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: `⚠️ **Notice**: Could not connect to Gemini service. Local AI Advisor suggests checking your network or trying again in a moment.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        text: `### 🔄 Chat Reset\n\nHow can I help you today? Ask about using SpamShield tools or strategies for consulting with clients.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "SpamShield-AI",
      },
    ]);
  };

  // Simple clean markdown-to-html helper
  const renderFormattedText = (raw: string) => {
    const lines = raw.split("\n");
    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-base font-bold text-emerald-400 mt-3 mb-1">
                {line.replace("### ", "")}
              </h3>
            );
          }
          if (line.startsWith("#### ")) {
            return (
              <h4 key={idx} className="text-sm font-semibold text-emerald-300 mt-2 mb-1">
                {line.replace("#### ", "")}
              </h4>
            );
          }
          if (line.startsWith("- ") || line.startsWith("* ")) {
            const content = line.substring(2);
            return (
              <li key={idx} className="ml-4 list-disc text-zinc-300">
                <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
              </li>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            const content = line.replace(/^\d+\.\s/, "");
            return (
              <li key={idx} className="ml-4 list-decimal text-zinc-300">
                <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
              </li>
            );
          }
          if (line.trim() === "") {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p key={idx} className="text-zinc-200">
              <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
            </p>
          );
        })}
      </div>
    );
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='text-emerald-200'>$1</em>")
      .replace(/`([^`]+)`/g, "<code class='bg-zinc-800 text-emerald-300 px-1 py-0.5 rounded text-xs font-mono'>$1</code>");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/40 p-6 rounded-xl border border-emerald-500/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">SpamShield AI Assistant</h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> GEMINI POWERED
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Your conversational guide for platform navigation & enterprise client security advisory.
            </p>
          </div>
        </div>

        {/* Model Switcher & Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-1 flex items-center gap-1 text-xs">
            <button
              onClick={() => setSelectedModel("gemini-2.5-flash")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedModel === "gemini-2.5-flash"
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ⚡ Flash (Fast)
            </button>
            <button
              onClick={() => setSelectedModel("gemini-2.5-pro")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedModel === "gemini-2.5-pro"
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🧠 Pro (Deep Analysis)
            </button>
          </div>

          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Quick Discussion Prompts
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp.prompt)}
              className="text-left p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 hover:border-emerald-500/40 hover:bg-zinc-800/60 transition-all group flex items-start gap-3"
            >
              <div className="p-1.5 rounded bg-zinc-800 group-hover:bg-emerald-500/20 text-emerald-400 transition-colors mt-0.5">
                <qp.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-zinc-400 group-hover:text-emerald-300 transition-colors">
                  {qp.category}
                </div>
                <div className="text-xs text-zinc-200 truncate font-medium mt-0.5">
                  {qp.label}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="bg-[#0F1115] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                      : "bg-zinc-800 border border-zinc-700 text-emerald-400"
                  }`}
                >
                  {isUser ? "YOU" : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-xl p-4 border relative group ${
                    isUser
                      ? "bg-emerald-600/15 border-emerald-500/30 text-white"
                      : "bg-zinc-900/90 border-zinc-800 text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/5">
                    <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                      {isUser ? "You" : "SpamShield AI"}
                      {m.source && (
                        <span className="text-[10px] text-emerald-400/80 font-mono bg-zinc-800/80 px-1.5 py-0.5 rounded">
                          {m.source}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">{m.timestamp}</span>
                      <button
                        onClick={() => copyToClipboard(m.text, m.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-white transition-opacity"
                        title="Copy text"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    {renderFormattedText(m.text)}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-3xl mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                SpamShield AI is analyzing threat telemetry and formulating response...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything: 'How to use SpamShield?', 'What to tell a client under attack?'..."
              disabled={loading}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold text-sm rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 px-1">
            <span>Powered by Gemini & SpamShield Threat Intelligence</span>
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>

      {/* Helpful Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          to="/"
          className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                Live Threat Dashboard
              </div>
              <div className="text-xs text-zinc-400">View real-time attack telemetry</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
        </Link>

        <Link
          to="/checker"
          className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                Number Checker
              </div>
              <div className="text-xs text-zinc-400">Scan suspicious caller numbers</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
        </Link>

        <Link
          to="/protection"
          className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                Personal Protection
              </div>
              <div className="text-xs text-zinc-400">Manage VIP numbers & whitelists</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
