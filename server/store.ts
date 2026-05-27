import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

export const memorySpamReports: any[] = [];
export const memoryProtectedNumbers: string[] = [];
export const memoryStats = {
  blockedToday: 12405,
  activeAttacks: 3,
  topSpamNumbers: [
    { number: "+91-9876543210", score: 98, reports: 125, type: "SMS Bomber" },
    { number: "+91-9988776655", score: 95, reports: 98, type: "OTP Bombing" },
    { number: "+91-8877665544", score: 89, reports: 76, type: "Scam" }
  ]
};
