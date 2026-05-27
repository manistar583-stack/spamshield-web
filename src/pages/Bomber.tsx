import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";

export function Bomber() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      number: formData.get("number"),
      type: "SMS Bomber",
      message: formData.get("evidence"),
    };

    try {
      await fetch("/api/spam/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      toast.success("Report Submitted", {
        description: "Our system will analyze and flag this number."
      });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error("Failed to submit report");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-8 animate-in fade-in duration-500">
      <div className="md:col-span-3 space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">Report SMS Bombing</h1>
          <p className="text-zinc-500 text-xs">Help the community by reporting numbers conducting SMS or OTP bombing attacks.</p>
        </div>

        <Card className="bg-[#0F1115] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center">
               <AlertTriangle className="w-5 h-5 mr-2 text-rose-500" />
               Report Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="number" className="text-zinc-300 text-xs">Attacker's Phone Number *</Label>
                <Input required id="number" name="number" placeholder="+91 99999 99999" className="bg-[#0A0B0D] border-zinc-800 text-white h-10 text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence" className="text-zinc-300 text-xs">Evidence / Sample Messages (Optional)</Label>
                <Textarea 
                  id="evidence" 
                  name="evidence" 
                  placeholder="Paste the spam messages here..." 
                  className="min-h-[120px] bg-[#0A0B0D] border-zinc-800 text-white text-sm" 
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-500 text-white">
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2 space-y-6">
        <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/40 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-emerald-500 text-sm font-bold">Auto-Detection Rules</CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-zinc-400 space-y-4">
            <p>
              SpamShield utilizes real-time heuristics to identify SMS Bomber profiles safely.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-emerald-400/80 marker:text-emerald-500">
              <li>&gt;10 identical messages in 5 minutes auto-raises Risk Score.</li>
              <li>Multiple user reports trigger global blacklist pooling.</li>
              <li>OTP templates from non-whitelisted sender IDs flagged immediately.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
