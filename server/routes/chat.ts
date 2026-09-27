import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const SYSTEM_INSTRUCTION = `You are SpamShield AI, the dedicated cyber-defense assistant and client advisory expert for SpamShield.
Your mission is twofold:
1. HOW TO USE SPAMSHIELD:
   - Guide users through SpamShield's tools:
     * Live Threat Dashboard: Real-time telemetry, Recharts attack trends, volume distribution, and live blocked threat feeds.
     * Number Checker: Deep carrier lookup, risk scoring (0-100), scam probability, and carrier spoof detection.
     * Bomber Detector: Real-time SMS & Call flood mitigations, OTP abuse prevention, and rate-limiting triggers.
     * Community Reports: Crowdsourced spam database where users submit and verify spam numbers and phishing messages.
     * Personal Protection: Whitelist numbers, active call interception, and custom blocking rules.
     * Admin & Simulation: Trigger live simulated attacks to test firewall resilience.
2. DISCUSS WITH CLIENTS & ENTERPRISE ADVISORY:
   - Provide professional, boardroom-ready guidance when security teams or account managers discuss spam defense with enterprise clients.
   - Explain how businesses can protect their customer authentication pipelines (OTP endpoints, registration forms, SMS gateways) from costly SMS pumping / SMS bomber fraud.
   - Advise on telecom compliance, DND (Do Not Disturb) registries, carrier-level reputation management, and client communication strategies during an ongoing attack.
   - Provide concrete client-facing talking points, executive summaries, and mitigation steps.

Tone & Format:
- Authoritative, professional, cyber-defense savvy, and friendly.
- Use structured Markdown with bold key terms, bullet points, and code/policy suggestions where helpful.
- Keep responses focused, actionable, and ready to share with clients or team members.`;

// Intelligent fallback knowledge base if API key is absent or rate-limited
function getFallbackResponse(userPrompt: string): string {
  const p = userPrompt.toLowerCase();
  
  if (p.includes("bomber") || p.includes("flood") || p.includes("otp") || p.includes("pumping")) {
    return `### 🛡️ Defending Against SMS Bomber & OTP Pumping Attacks

Here is how SpamShield handles this and what to advise your clients:

#### 1. How SpamShield Detects & Blocks It:
- **Rate-Limiting Triggers**: Flags any phone number receiving >5 SMS/minute from diverse aggregator gateways.
- **Fingerprinting**: Identifies automated script requests targeting public authentication endpoints.
- **Automated Refusal**: Instantly shields the victim's number and alerts the carrier gateway.

#### 2. What to Tell Your Business Client:
- **Implement Captcha**: Require Cloudflare Turnstile or reCAPTCHA v3 on all OTP and signup triggers.
- **Carrier Route Throttling**: Restrict OTP requests per IP (max 3/min) and per destination MSISDN (max 2/min).
- **Silent Drop Mode**: Silently accept but delay delivery for high-velocity bot requests without notifying the attacker.
- **Cost Alerting**: Set daily spending ceilings on Twilio, Sinch, or AWS SNS accounts to prevent billing blowouts.`;
  }

  if (p.includes("client") || p.includes("discuss") || p.includes("pitch") || p.includes("enterprise") || p.includes("business")) {
    return `### 💼 Enterprise Client Advisory & Communication Blueprint

When discussing SpamShield protection with your enterprise clients, highlight these core pillars:

#### 1. Financial Impact Prevention
- **Toll Fraud & Pumping**: Automated bombers drain thousands of dollars in SMS gateway fees within hours. SpamShield eliminates fraudulent dispatch before carrier billing triggers.
- **Customer Churn Prevention**: End-users flooded with spam OTPs often abandon services. Real-time protection safeguards brand trust.

#### 2. Technical Safeguards to Recommend:
- **API Shielding**: Integrate SpamShield's real-time risk lookup API at your signup/login endpoint.
- **Risk Scoring**: Check incoming numbers prior to dispatching costly verification codes.
- **Compliance**: Adhere to TRAI / FCC telecom anti-spoofing standards (STIR/SHAKEN).

#### 3. Recommended Talking Point:
*"SpamShield acts as an intelligent firewall between your customer endpoints and telecom aggregators, reducing fraudulent OTP dispatches by up to 98% while ensuring legitimate users receive instant verification."*`;
  }

  if (p.includes("check") || p.includes("number") || p.includes("score") || p.includes("risk")) {
    return `### 🔍 How to Use the Number Checker

To evaluate any suspicious phone number in SpamShield:
1. Navigate to **Number Checker** from the sidebar (or press the top search bar).
2. Enter the target number with country code (e.g., \`+91 98765 43210\`).
3. SpamShield will analyze:
   - **Risk Score (0 - 100)**: Aggregated threat level based on known attacks.
   - **Threat Category**: Identifies SMS Bomber, KYC Phishing, Robocall Spoofer, or Impersonation.
   - **Carrier & Telephony Region**: Origin carrier routing telemetry.
   - **Community Reports**: Verifies crowd reports and user testimonies.
4. If flagged as High Risk, click **"Add to Personal Protection"** to permanently block incoming communications.`;
  }

  if (p.includes("how to use") || p.includes("start") || p.includes("guide") || p.includes("dashboard")) {
    return `### 🚀 Quick Start Guide: Mastering SpamShield

Welcome to SpamShield! Here is an overview of how to navigate and use the platform:

1. **Live Threat Dashboard** (\`/\`):
   - Real-time Recharts charts showing spam calls vs. SMS spikes.
   - Live stream of intercepted threats with carrier origin and AI confidence scores.
   - Use the **Simulate Attack** button to test firewall defenses.

2. **Number Checker** (\`/checker\`):
   - Instant reputation lookup and threat categorization for any phone number.

3. **Bomber Detector** (\`/bomber\`):
   - Monitors rapid-fire OTP and SMS flooding attacks with immediate rate-limiting.

4. **Community Center** (\`/community\`):
   - View recent spam alerts reported by other users and submit new scam reports.

5. **Personal Protection** (\`/protection\`):
   - Add your personal and executive numbers to the high-security whitelist.

6. **AI Advisor** (\`/advisor\` or floating widget):
   - Ask for live technical advice, client pitch assistance, or threat analysis anytime!`;
  }

  return `### 🤖 SpamShield AI Assistant

I am here to help you navigate SpamShield and assist you in client security discussions.

**What would you like to explore?**
- **How to use SpamShield**: Ask about the Realtime Dashboard, Number Checker, or Bomber Detector.
- **Client Discussions**: Ask how to advise business clients on preventing SMS pumping, OTP toll fraud, and robocall floods.
- **Technical Best Practices**: Ask about rate limiting, STIR/SHAKEN telecom verification, and carrier whitelist strategies.`;
}

router.post("/", async (req, res) => {
  try {
    const { messages, model = "gemini-2.5-flash" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.text || lastMessage.content || "";

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key is configured or set up, deliver high-quality expert responses
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found in environment, using SpamShield AI Knowledge Engine");
      const fallbackReply = getFallbackResponse(userPrompt);
      return res.json({
        reply: fallbackReply,
        model: "SpamShield-AI-Local",
        source: "engine"
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      // Prepare multi-turn history
      // Map roles: 'user' -> 'user', 'assistant'/'model' -> 'model'
      const formattedContents = messages.map((m: { role: string; text?: string; content?: string }) => {
        const text = m.text || m.content || "";
        const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
        return {
          role,
          parts: [{ text }]
        };
      });

      // Ensure first message has role 'user'
      if (formattedContents.length > 0 && formattedContents[0].role !== "user") {
        formattedContents.unshift({
          role: "user",
          parts: [{ text: "Hello" }]
        });
      }

      // Selected model or fallback to gemini-2.5-flash
      const targetModel = model.includes("pro") ? "gemini-2.5-pro" : "gemini-2.5-flash";

      const response = await ai.models.generateContent({
        model: targetModel,
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I was unable to generate a response. Please try rephrasing your question.";

      return res.json({
        reply: replyText,
        model: targetModel,
        source: "gemini"
      });
    } catch (genAiErr: any) {
      console.error("Gemini API call failed, using intelligent fallback:", genAiErr?.message || genAiErr);
      const fallbackReply = getFallbackResponse(userPrompt);
      return res.json({
        reply: fallbackReply,
        model: "SpamShield-AI-Fallback",
        source: "engine_fallback",
        note: genAiErr?.message ? `Notice: ${genAiErr.message}` : undefined
      });
    }
  } catch (err: any) {
    console.error("Chat router error:", err);
    return res.status(500).json({ error: "Failed to process chat request" });
  }
});

export default router;
