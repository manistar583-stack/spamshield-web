import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShieldAlert, ShieldCheck, Activity, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Checker() {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setNumber(q);
    }
  }, []);

  useEffect(() => {
    if (!number.trim()) {
      setResult(null);
      return;
    }
    
    setLoading(true);
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/spam/check/${encodeURIComponent(number)}`);
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [number]);

  const checkNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handled by useEffect now
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-xl font-bold tracking-tight text-white">Number Checker</h1>
        <p className="text-zinc-500 text-xs">Instantly analyze any phone number against our global threat database.</p>
      </div>

      <Card className="bg-[#0F1115] border-zinc-800 shadow-xl">
        <CardContent className="pt-6">
          <form onSubmit={checkNumber} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input 
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="e.g. +91 98765 43210" 
                className="pl-10 bg-[#0A0B0D] border-zinc-800 h-10 text-sm text-white" 
              />
            </div>
            <Button type="submit" disabled={loading} className="h-10 px-8 text-sm bg-emerald-600 hover:bg-emerald-500 text-white">
              {loading ? "Scanning..." : "Check Risk"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className={`border ${result.risk === 'High' ? 'border-rose-500/50 bg-rose-500/5' : result.risk === 'Medium' ? 'border-amber-500/50 bg-amber-500/5' : 'border-emerald-500/50 bg-emerald-500/5'}`}>
            <CardHeader>
              <CardTitle className="text-zinc-200">Risk Analysis</CardTitle>
              <CardDescription>Results for <span className="font-mono text-white">{result.number}</span></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold font-mono tracking-tighter text-white">{result.score}</div>
                  <div className="text-sm text-zinc-500 mt-1 uppercase tracking-wider font-semibold">Risk Score</div>
                </div>
                {result.risk === 'High' ? (
                  <ShieldAlert className="w-16 h-16 text-rose-500" />
                ) : result.risk === 'Medium' ? (
                  <Activity className="w-16 h-16 text-amber-500" />
                ) : (
                  <ShieldCheck className="w-16 h-16 text-emerald-500" />
                )}
              </div>
              <div className="mt-8">
                <Badge variant={result.risk === 'High' ? 'destructive' : result.risk === 'Medium' ? 'outline' : 'default'} className="text-sm px-3 py-1">
                  {result.risk} Risk Level
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0F1115] border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-200 text-sm">Threat Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-zinc-300">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center text-zinc-500 font-bold uppercase tracking-wider">
                  <Activity className="w-3 h-3 mr-2" /> Report Count
                </div>
                <div className="font-mono font-medium text-white">{result.reportCount} reports</div>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center text-zinc-500 font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3 h-3 mr-2" /> Primary Threat
                </div>
                <div className="font-medium text-white">{result.risk === 'Protected' ? 'Safe (Protected)' : result.risk === 'Low' ? 'None (Safe)' : (result.type || 'Unknown')}</div>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center text-zinc-500 font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3 mr-2" /> Last Detected
                </div>
                <div className="font-medium text-white">
                  {result.lastReported ? new Date(result.lastReported).toLocaleString() : 'Never'}
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center text-zinc-500 font-bold uppercase tracking-wider">
                  Service Provider
                </div>
                <div className="font-medium text-white">{result.provider || 'Unknown'}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-zinc-500 font-bold uppercase tracking-wider">
                  Region
                </div>
                <div className="font-medium text-white">{result.location || 'Unknown'}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
