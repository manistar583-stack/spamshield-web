import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Admin() {
  const [reports, setReports] = useState([]);
  
  useEffect(() => {
    fetch("/api/spam").then(res => res.json()).then(data => setReports(data.reports));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">Admin Panel</h1>
          <p className="text-zinc-500 text-xs">Moderate recent crowdsourced spam reports and adjust flagging algorithms.</p>
        </div>
      </div>

      <Card className="bg-[#0F1115] border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
           <div>
             <CardTitle className="text-zinc-100 text-sm">Live Report Queue</CardTitle>
             <CardDescription className="text-xs">All incoming community reports pending review.</CardDescription>
           </div>
           <div className="relative max-w-sm w-full md:w-auto">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
             <Input placeholder="Search number..." className="bg-[#0A0B0D] border-zinc-800 pl-9 w-64 text-white h-9 text-xs" />
           </div>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center p-8 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              No reports in queue. Everything is quiet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableHead className="text-zinc-400">Timestamp</TableHead>
                  <TableHead className="text-zinc-400">Target Number</TableHead>
                  <TableHead className="text-zinc-400">Threat Type</TableHead>
                  <TableHead className="text-zinc-400">User Comments</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report: any) => (
                  <TableRow key={report.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="text-zinc-400">{new Date(report.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell className="font-mono text-white">{report.number}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#0A0B0D] border-zinc-700 text-zinc-300 text-[10px]">{report.type}</Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 max-w-xs truncate">{report.message || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 mr-2">Approve</Button>
                      <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">Reject</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
