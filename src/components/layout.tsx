import { Outlet, Link, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Search, AlertTriangle, Users, Lock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/checker", label: "Number Checker", icon: Search },
  { href: "/bomber", label: "Bomber Detector", icon: AlertTriangle },
  { href: "/community", label: "Community", icon: Users },
  { href: "/protection", label: "Personal Protection", icon: Lock },
  { href: "/admin", label: "Admin Panel", icon: Settings },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-[#0A0B0D] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0F1115] border-r border-zinc-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white uppercase">SpamShield</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors font-medium border",
                location.pathname === link.href 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "text-slate-400 border-transparent hover:bg-white/5"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Shield Status</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <p className="text-xs text-slate-300 font-mono">v4.2.0-STABLE</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0B0D]">
        {/* Desktop Header */}
        <header className="h-16 border-b border-zinc-800 items-center justify-between px-8 bg-[#0F1115]/50 backdrop-blur-md hidden md:flex">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search +91 number for risk score..."
                className="w-full bg-[#0A0B0D] border border-zinc-800 text-sm rounded-md pl-10 px-3 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/checker?q=${encodeURIComponent(e.currentTarget.value)}`;
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-[11px] font-semibold text-emerald-500">SYSTEM ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="h-16 md:hidden flex items-center px-4 border-b border-zinc-800 bg-[#0F1115]">
           <Shield className="w-6 h-6 text-emerald-500 mr-2" />
           <span className="font-semibold text-lg text-white uppercase">SpamShield</span>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
