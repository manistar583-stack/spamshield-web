import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, TrendingUp, AlertCircle, Filter } from "lucide-react";

export function Community() {
  const [data, setData] = useState<any>({ topSpamNumbers: [] });
  const [filterType, setFilterType] = useState<string>("All");

  useEffect(() => {
    fetch("/api/stats").then(res => res.json()).then(setData);
  }, []);

  const filteredNumbers = data.topSpamNumbers.filter((num: any) => 
    filterType === "All" ? true : num.type === filterType
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white mb-1">Community Intelligence</h1>
        <p className="text-zinc-500 text-xs">Crowdsourced leaderboard of the highest-risk numbers in your region.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-[#0F1115] border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0.5 pb-4">
              <CardTitle className="text-zinc-100 flex items-center text-sm">
                <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                Global Spam Leaderboard
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-zinc-500 hidden sm:block" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px] h-8 bg-[#0A0B0D] border-zinc-800 text-xs text-white">
                    <SelectValue placeholder="All Threats" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F1115] border-zinc-800 text-slate-200">
                    <SelectItem value="All">All Threats</SelectItem>
                    <SelectItem value="SMS Bomber">SMS Bomber</SelectItem>
                    <SelectItem value="OTP Bombing">OTP Bombing</SelectItem>
                    <SelectItem value="Scam">Scam</SelectItem>
                    <SelectItem value="Promotional">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                    <TableHead className="text-zinc-400">Rank</TableHead>
                    <TableHead className="text-zinc-400">Number</TableHead>
                    <TableHead className="text-zinc-400">Risk Score</TableHead>
                    <TableHead className="text-zinc-400">Type</TableHead>
                    <TableHead className="text-right text-zinc-400">Reports</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNumbers.map((num: any, idx: number) => (
                    <TableRow key={idx} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell className="font-bold text-zinc-500">#{idx + 1}</TableCell>
                      <TableCell className="font-mono text-white font-medium">{num.number}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full mr-2 ${num.score > 90 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                          <span className="text-zinc-300">{num.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-[#0A0B0D] border-zinc-700 text-zinc-300 text-[10px]">{num.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-400">{num.reports}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#0F1115] border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
                Trending Threats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Fake KYC Scams</span>
                <span className="text-rose-500 flex items-center">High <TrendingUp className="w-3 h-3 ml-1" /></span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Amazon Delivery Auth</span>
                <span className="text-amber-500 flex items-center">Medium <TrendingUp className="w-3 h-3 ml-1" /></span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">OTP Bombing</span>
                <span className="text-rose-500 flex items-center">High <TrendingUp className="w-3 h-3 ml-1" /></span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
            <h3 className="font-semibold text-indigo-100 mb-2">Join the Defense</h3>
            <p className="text-sm text-indigo-200/70 mb-4">You can download our local blocking profiles daily to keep your personal device safe natively.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
