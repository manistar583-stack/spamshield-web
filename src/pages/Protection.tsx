import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Lock, Smartphone, Shield, Download, BrainCircuit, ScanSearch, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Protection() {
  const [active, setActive] = useState(true);
  const [aiSms, setAiSms] = useState(true);
  const [aiCalls, setAiCalls] = useState(true);
  const [aiSentinel, setAiSentinel] = useState(true);

  const [protectedNumbers, setProtectedNumbers] = useState<string[]>([]);
  const [newNumber, setNewNumber] = useState("");

  useEffect(() => {
    fetch("/api/spam/protected")
      .then(res => res.json())
      .then(data => {
        if (data && data.protectedNumbers) {
          setProtectedNumbers(data.protectedNumbers);
        }
      });
  }, []);

  const handleProtect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNumber.trim() && !protectedNumbers.includes(newNumber)) {
      const res = await fetch("/api/spam/protect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: newNumber.trim() })
      });
      const data = await res.json();
      if (data.protectedNumbers) {
        setProtectedNumbers(data.protectedNumbers);
        setNewNumber("");
      }
    }
  };

  const handleUnprotect = async (num: string) => {
    const res = await fetch("/api/spam/unprotect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: num })
    });
    const data = await res.json();
    if (data.protectedNumbers) {
      setProtectedNumbers(data.protectedNumbers);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white mb-1">Personal Protection</h1>
        <p className="text-zinc-500 text-xs">Manage your device protection rules and synchronization.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-[#0F1115] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center text-sm">
              <Shield className="w-5 h-5 mr-4 text-emerald-500" />
              Real-time Call/SMS Blocking
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Enable active interception of known malicious numbers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between border-t border-zinc-800 pt-6">
             <span className="font-medium text-zinc-300">Status</span>
             <Switch checked={active} onCheckedChange={setActive} className="data-[state=checked]:bg-emerald-500" />
          </CardContent>
        </Card>

        <Card className="bg-[#0F1115] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center text-sm">
              <Smartphone className="w-5 h-5 mr-4 text-emerald-500" />
              Device Sync
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Download the latest static blocklist for native Android/iOS blocking.
            </CardDescription>
          </CardHeader>
          <CardContent className="border-t border-zinc-800 pt-6">
            <Button className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white">
               <Download className="w-4 h-4 mr-2" /> Download Offline Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 mb-4">
        <h2 className="text-lg font-bold tracking-tight text-white mb-1 flex items-center">
          <BrainCircuit className="w-5 h-5 mr-2 text-indigo-400" />
          Neural Active Defense
        </h2>
        <p className="text-zinc-500 text-xs">AI-powered threat detection algorithms.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-indigo-950/20 border-indigo-500/20">
          <CardHeader>
            <CardTitle className="text-indigo-100 flex items-center text-sm">
              <ScanSearch className="w-5 h-5 mr-3 text-indigo-400" />
              Verified SMS Scan
            </CardTitle>
            <CardDescription className="text-indigo-200/50 text-xs mt-2">
              Automatically scans SMS content using LLMs to detect phishing and smishing attempts.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between border-t border-indigo-500/20 pt-4">
             <span className="text-xs font-bold uppercase text-indigo-300">Engine Status</span>
             <Switch checked={aiSms} onCheckedChange={setAiSms} className="data-[state=checked]:bg-indigo-500 scale-75 origin-right" />
          </CardContent>
        </Card>

        <Card className="bg-indigo-950/20 border-indigo-500/20">
          <CardHeader>
            <CardTitle className="text-indigo-100 flex items-center text-sm">
              <Bot className="w-5 h-5 mr-3 text-indigo-400" />
              AI Call Screening
            </CardTitle>
            <CardDescription className="text-indigo-200/50 text-xs mt-2">
              Deep-learning model transcribes and evaluates intent of unknown callers in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between border-t border-indigo-500/20 pt-4">
             <span className="text-xs font-bold uppercase text-indigo-300">Engine Status</span>
             <Switch checked={aiCalls} onCheckedChange={setAiCalls} className="data-[state=checked]:bg-indigo-500 scale-75 origin-right" />
          </CardContent>
        </Card>

        <Card className="bg-indigo-950/20 border-indigo-500/20">
          <CardHeader>
            <CardTitle className="text-indigo-100 flex items-center text-sm">
              <Shield className="w-5 h-5 mr-3 text-indigo-400" />
              Auto-Detect Sentinel
            </CardTitle>
            <CardDescription className="text-indigo-200/50 text-xs mt-2">
              Proactively identifies new scam patterns without waiting for community reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between border-t border-indigo-500/20 pt-4">
             <span className="text-xs font-bold uppercase text-indigo-300">Engine Status</span>
             <Switch checked={aiSentinel} onCheckedChange={setAiSentinel} className="data-[state=checked]:bg-indigo-500 scale-75 origin-right" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#0F1115] border-zinc-800 mt-6">
        <CardHeader>
           <CardTitle className="text-zinc-100 flex items-center text-sm">
             <Lock className="w-5 h-5 mr-3 text-emerald-500" />
             Custom Block Rules
           </CardTitle>
           <CardDescription className="text-zinc-400 text-xs">
             Manually add specific numbers to your personal blocklist to protect your device.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <form onSubmit={handleProtect} className="flex gap-2">
             <input 
               type="text" 
               value={newNumber}
               onChange={(e) => setNewNumber(e.target.value)}
               placeholder="Enter phone number (e.g. +91 9876543210)" 
               className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
             />
             <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
               Protect Number
             </Button>
           </form>

           {protectedNumbers.length > 0 && (
             <div className="mt-4 space-y-2">
               <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Protected Numbers</h3>
               {protectedNumbers.map((num, i) => (
                 <div key={i} className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-md">
                   <div className="flex items-center gap-3">
                     <Lock className="w-4 h-4 text-emerald-500" />
                     <span className="text-sm text-zinc-200">{num}</span>
                   </div>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={() => handleUnprotect(num)}
                     className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 text-xs"
                   >
                     Remove
                   </Button>
                 </div>
               ))}
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
