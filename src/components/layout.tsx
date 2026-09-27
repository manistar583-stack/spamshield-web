import { Outlet, Link, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Search, AlertTriangle, Users, Lock, Settings, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingChatWidget } from "./chat/FloatingChatWidget";
import { SidebarThemeToggle, HeaderThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/checker", label: "Number Checker", icon: Search },
  { href: "/bomber", label: "Bomber Detector", icon: AlertTriangle },
  { href: "/community", label: "Community", icon: Users },
  { href: "/protection", label: "Personal Protection", icon: Lock },
  { href: "/advisor", label: "AI Advisor & Bot", icon: Bot, isNew: true },
  { href: "/admin", label: "Admin Panel", icon: Settings },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#0A0B0D] text-slate-900 dark:text-slate-200 overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#0F1115] border-r border-slate-200 dark:border-zinc-800 flex flex-col hidden md:flex transition-colors duration-200">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white uppercase">SpamShield</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors font-medium border",
                location.pathname === link.href 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold" 
                  : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon className={cn("w-4 h-4", link.isNew && "text-emerald-500 dark:text-emerald-400")} />
                {link.label}
              </div>
              {link.isNew && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer with Theme Toggle */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 space-y-3">
          <SidebarThemeToggle />

          <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-lg p-2.5 border border-slate-200 dark:border-zinc-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-500">Shield Status</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">v4.2.0-STABLE</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0A0B0D] transition-colors duration-200">
        {/* Desktop Header */}
        <header className="h-16 border-b border-slate-200 dark:border-zinc-800 items-center justify-between px-8 bg-white/80 dark:bg-[#0F1115]/50 backdrop-blur-md hidden md:flex transition-colors duration-200">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-zinc-500">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search +91 number for risk score..."
                className="w-full bg-slate-100 dark:bg-[#0A0B0D] border border-slate-300 dark:border-zinc-800 text-sm rounded-md pl-10 px-3 py-1.5 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/checker?q=${encodeURIComponent(e.currentTarget.value)}`;
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HeaderThemeToggle />

            <Link
              to="/advisor"
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all group"
            >
              <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform text-emerald-600 dark:text-emerald-400" />
              <span>Ask AI Assistant</span>
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </Link>

            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-500">SYSTEM ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="h-16 md:hidden flex items-center justify-between px-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0F1115] transition-colors duration-200">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-emerald-500 mr-2" />
            <span className="font-semibold text-lg text-slate-900 dark:text-white uppercase">SpamShield</span>
          </div>
          <div className="flex items-center gap-2">
            <HeaderThemeToggle />
            <Link
              to="/advisor"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold"
            >
              <Bot className="w-4 h-4" />
              <span>AI Bot</span>
            </Link>
          </div>
        </header>

        <div
          className="flex-1 overflow-auto p-6 scroll-smooth overscroll-contain"
          style={{ willChange: "scroll-position", WebkitOverflowScrolling: "touch" }}
        >
          <Outlet />
        </div>

        {/* Persistent Floating AI Chatbot on all pages */}
        <FloatingChatWidget />
      </main>
    </div>
  );
}
