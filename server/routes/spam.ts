import express from "express";
import { memorySpamReports, memoryStats, memoryProtectedNumbers, io } from "../store";

const router = express.Router();

router.get("/protected", (req, res) => {
  res.json({ protectedNumbers: memoryProtectedNumbers });
});

router.post("/protect", (req, res) => {
  const { number } = req.body;
  if (!number) return res.status(400).json({ error: "Number is required" });
  
  if (!memoryProtectedNumbers.includes(number)) {
    memoryProtectedNumbers.push(number);
  }
  res.json({ success: true, protectedNumbers: memoryProtectedNumbers });
});

router.post("/unprotect", (req, res) => {
  const { number } = req.body;
  if (!number) return res.status(400).json({ error: "Number is required" });
  
  const index = memoryProtectedNumbers.indexOf(number);
  if (index > -1) {
    memoryProtectedNumbers.splice(index, 1);
  }
  res.json({ success: true, protectedNumbers: memoryProtectedNumbers });
});

router.get("/", (req, res) => {
  res.json({ reports: memorySpamReports });
});

router.post("/report", (req, res) => {
  const { number, type, message } = req.body;
  if (!number) return res.status(400).json({ error: "Number is required" });
  
  const newReport = {
    id: Date.now().toString(),
    number,
    type: type || "Scam",
    message: message || "",
    timestamp: new Date()
  };
  
  memorySpamReports.unshift(newReport);
  memoryStats.blockedToday++;

  // Simple auto-flag logic (if reported multiple times, etc.)
  
  // Real-time broadcast
  io.emit("spam:new", newReport);
  io.emit("stats:update", memoryStats);
  
  res.json({ success: true, report: newReport });
});

router.get("/check/:number", (req, res) => {
  const num = req.params.number;
  const numDigits = num.replace(/\D/g, '');
  const searchDigits = numDigits.length === 10 ? '91' + numDigits : numDigits;
  const reports = memorySpamReports.filter(r => r.number.replace(/\D/g, '') === searchDigits || r.number.replace(/\D/g, '') === numDigits);
  
  // Dummy data generation based on first characters of the number
  const providers = ["Airtel", "Jio", "Vi India", "BSNL Mobile", "MTNL"];
  const locations = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Kerala", "Punjab", "Andhra Pradesh", "West Bengal"];
  const randomProvider = providers[Math.abs(num.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % providers.length];
  const randomLocation = locations[Math.abs(num.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % locations.length];

  let result = {
    number: num,
    risk: "Low",
    score: 5,
    reportCount: 0,
    lastReported: null,
    provider: randomProvider,
    location: randomLocation,
    type: "Mobile"
  };

  const isProtected = memoryProtectedNumbers.some(p => p.replace(/\D/g, '') === numDigits) || memoryProtectedNumbers.includes(num);

  if (isProtected) {
    result = { ...result, risk: "Protected", score: 0, type: "Safe (Protected)" };
  } else if (reports.length > 5) {
    result = { ...result, risk: "High", score: 95, reportCount: reports.length, lastReported: reports[0]?.timestamp, type: reports[0]?.type || result.type };
  } else if (reports.length > 0) {
    result = { ...result, risk: "Medium", score: 50, reportCount: reports.length, lastReported: reports[0]?.timestamp, type: reports[0]?.type || result.type };
  } else {
    // Check top spam array
    const top = memoryStats.topSpamNumbers.find(t => {
      const tDigits = t.number.replace(/\D/g, '');
      return tDigits === searchDigits || tDigits === numDigits;
    });
    if (top) {
      result = { ...result, risk: "High", score: top.score, reportCount: top.reports, lastReported: new Date(), type: top.type || result.type };
    }
  }
  
  res.json(result);
});

export default router;
