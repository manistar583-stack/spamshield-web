import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldAlert, Activity, Users, Zap } from "lucide-react";
import { socket } from "@/lib/socket";
import { Stats, SpamReport } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ blockedToday: 0, activeAttacks: 0, topSpamNumbers: [] });
  const [feed, setFeed] = useState<SpamReport[]>([]);
  const [protectedMode, setProtectedMode] = useState(true);

  useEffect(() => {
    // Fetch initial state
    fetch("/api/stats").then(res => res.json()).then(setStats);
    fetch("/api/spam").then(res => res.json()).then(data => setFeed(data.reports));

    socket.on("stats:update", setStats);
    socket.on("spam:new", (report) => {
      setFeed(prev => [report, ...prev].slice(0, 50));
    });

    return () => {
      socket.off("stats:update");
      socket.off("spam:new");
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">Live Dashboard</h1>
          <p className="text-zinc-500 text-xs">Real-time threat monitoring and protection status.</p>
        </div>
        <div className="flex items-center space-x-3 bg-[#0F1115] px-3 py-1.5 rounded-lg border border-zinc-800">
          <Label htmlFor="protection-mode" className="text-[11px] font-bold uppercase text-zinc-400">
            Active Protection
          </Label>
          <Switch 
            id="protection-mode" 
            checked={protectedMode}
            onCheckedChange={setProtectedMode}
            className="data-[state=checked]:bg-emerald-500 scale-75 origin-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0F1115] border border-zinc-800 p-4 rounded-xl">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Blocked Today</p>
          <h3 className="text-2xl font-mono font-bold mt-1 text-white">{stats.blockedToday.toLocaleString()}</h3>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center">
             <Activity className="w-3 h-3 mr-1" /> +12% vs yesterday
          </p>
        </div>
        <div className="bg-[#0F1115] border border-zinc-800 p-4 rounded-xl">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Active Attacks</p>
          <h3 className="text-2xl font-mono font-bold mt-1 text-orange-500">{stats.activeAttacks}</h3>
          <p className="text-[10px] text-orange-400 mt-1">{stats.activeAttacks} High Severity</p>
        </div>
        <div className="bg-[#0F1115] border border-zinc-800 p-4 rounded-xl">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Risk Index</p>
          <h3 className="text-2xl font-mono font-bold mt-1 text-white">LOW</h3>
          <div className="w-full bg-zinc-800 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[15%]"></div>
          </div>
        </div>
        <div className="bg-[#0F1115] border border-zinc-800 p-4 rounded-xl">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Network Uptime</p>
          <h3 className="text-2xl font-mono font-bold mt-1 text-white">99.98%</h3>
          <p className="text-[10px] text-zinc-500 mt-1">Node: IN-WEST-01</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        <div className="md:col-span-2 bg-[#0F1115] border border-zinc-800 rounded-xl flex flex-col min-h-0">
          <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Live Spam Intelligence Feed</h2>
            <span className="text-[10px] font-mono text-zinc-600">REAL-TIME STREAMING</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-[#0F1115] z-10">
                  <tr className="text-[10px] text-zinc-500 border-b border-zinc-800">
                    <th className="px-6 py-3 font-bold">TIMESTAMP</th>
                    <th className="px-6 py-3 font-bold">SOURCE</th>
                    <th className="px-6 py-3 font-bold">TYPE</th>
                    <th className="px-6 py-3 font-bold">MESSAGE</th>
                    <th className="px-6 py-3 font-bold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {feed.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-zinc-500 font-sans">No recent activity</td>
                    </tr>
                  ) : (
                    feed.map((report) => (
                      <tr key={report.id} className="border-b border-zinc-900 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-3 text-zinc-500">
                          {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="px-6 py-3">{report.number}</td>
                        <td className="px-6 py-3 text-zinc-400">{report.type}</td>
                        <td className="px-6 py-3 text-zinc-500 truncate max-w-[120px]" title={report.message}>
                          {report.message || "N/A"}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-emerald-500 underline cursor-pointer text-[10px] font-bold">BLOCKED</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
            <p className="text-[10px] text-zinc-500">Scanning 4.2M known spam signatures...</p>
            <button className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded transition-colors uppercase font-bold">Export Logs</button>
          </div>
        </div>

        <div className="space-y-6 flex flex-col min-h-0">
          <div className="bg-[#0F1115] border border-zinc-800 rounded-xl p-5 flex-1 overflow-hidden flex flex-col">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 shrink-0">Top Spammers</h2>
            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-4">
                {stats.topSpamNumbers.map((num, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-zinc-600">{(i + 1).toString().padStart(2, '0')}</span>
                      <span className="text-xs font-mono">{num.number}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded border border-rose-500/20">
                      {num.reports} Reports
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <button className="w-full mt-6 py-2 border border-zinc-800 rounded-lg text-[10px] font-bold uppercase hover:bg-white/5 transition-colors shrink-0 text-zinc-400">
              View Leaderboard
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-emerald-100">Self-Protection</h3>
            </div>
            <p className="text-[11px] text-emerald-400/80 mb-4 leading-relaxed">
              SMS Bomber Auto-Refuse is enabled. Your number is protected against 100+ concurrent requests.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-emerald-300">Active Since</span>
              <span className="text-[10px] font-mono text-emerald-200">14 Jan 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
