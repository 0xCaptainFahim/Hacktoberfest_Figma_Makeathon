import express from "express";
import { writeReply } from "./src/reply.js";
import { extractSkills } from "./src/cerebras.js";
import { matchMentors, allMentors, findMentor } from "./src/match.js";
import { sanitizeChatHistory } from "./src/chat.js";
import {
  stripeEnabled,
  onboardMentor,
  accountStatus,
  connectedAccountFor,
  createBookingCheckout,
} from "./src/stripe.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

if (process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")) {
  console.error("Refusing to start: use a Stripe TEST key (sk_test_...) for this project.");
  process.exit(1);
}

// 1. Mentors catalog
app.get("/api/mentors", (_req, res) => res.json(allMentors()));

// 2. Chat: Qwen on Cerebras / defensive local engine -> extract skills -> match -> reply
app.post("/api/chat", async (req, res) => {
  try {
    const history = sanitizeChatHistory(req.body.history);
    const last = history.filter((m) => m.role === "user").at(-1)?.content || "";
    const { skills, latencyMs } = await extractSkills(last);
    const mentors = matchMentors(skills);
    const reply = await writeReply(history, mentors);
    res.json({ reply, skills, mentors, cerebrasLatencyMs: latencyMs });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Static Cybersecurity Code Vulnerability Scanner
app.post("/api/analyze", async (req, res) => {
  try {
    const { code } = req.body || {};
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Code is required" });
    }

    const lowerCode = code.toLowerCase();
    const issues = [];
    let score = 100;
    let suggestion = "// No vulnerabilities detected in static analysis.";

    if (lowerCode.includes("select") && (lowerCode.includes("${") || lowerCode.includes("+ req.") || lowerCode.includes("+ user"))) {
      issues.push({
        title: "SQL Injection (SQLi)",
        level: "Critical",
        cwe: "CWE-89",
        description: "Unsanitized user input is directly concatenated into a SQL query, allowing database takeover.",
      });
      score -= 40;
      suggestion = `// Safe Parameterized Query:\nconst userId = req.query.id;\nconst result = await db.query('SELECT * FROM users WHERE id = ?', [userId]);`;
    }

    if (lowerCode.includes("innerhtml") || lowerCode.includes("document.write")) {
      issues.push({
        title: "Cross-Site Scripting (DOM XSS)",
        level: "Critical",
        cwe: "CWE-79",
        description: "Directly writing untrusted user input to the DOM allows execution of malicious JavaScript.",
      });
      score -= 35;
      suggestion = `// Safe DOM manipulation:\nconst clean = DOMPurify.sanitize(userInput);\nelement.textContent = clean; // Prefer textContent over innerHTML`;
    }

    if (lowerCode.includes("jwt.verify") && lowerCode.includes("ignoreexpiration")) {
      issues.push({
        title: "Insecure JWT Validation",
        level: "Warning",
        cwe: "CWE-287",
        description: "JWT expiration verification is bypassed, allowing expired tokens to be accepted indefinitely.",
      });
      score -= 20;
      suggestion = `// Enforce token expiration and algorithm checks:\njwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });`;
    }

    if (lowerCode.includes("jwt.sign") && (lowerCode.includes("'secret'") || lowerCode.includes('"secret"'))) {
      issues.push({
        title: "Hardcoded Weak JWT Secret",
        level: "Critical",
        cwe: "CWE-798",
        description: "Hardcoded weak secret key in JWT signing makes tokens forgeable by attackers.",
      });
      score -= 30;
      suggestion = `// Load cryptographic secret from environment variable:\nreturn jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });`;
    }

    if ((lowerCode.includes("exec(") || lowerCode.includes("execsync(")) && (lowerCode.includes("req.") || lowerCode.includes("ping") || lowerCode.includes("${"))) {
      issues.push({
        title: "Command Injection (RCE)",
        level: "Critical",
        cwe: "CWE-78",
        description: "Unsanitized input passed directly to system shell execution can result in arbitrary server takeover.",
      });
      score -= 45;
      suggestion = `// Use execFile with explicit argument arrays:\nconst { execFile } = await import('child_process');\nexecFile('ping', ['-c', '4', sanitizeHost(domain)], (err, stdout) => { ... });`;
    }

    if (lowerCode.includes("node-serialize") || lowerCode.includes("unserialize")) {
      issues.push({
        title: "Insecure Object Deserialization",
        level: "Critical",
        cwe: "CWE-502",
        description: "Deserializing untrusted data with node-serialize allows Remote Code Execution via IIFE payloads.",
      });
      score -= 50;
      suggestion = `// Avoid node-serialize; use safe native JSON parsing:\nconst userObj = JSON.parse(req.cookies.profile);`;
    }

    if (issues.length === 0) {
      issues.push({
        title: "Clean Defensive Baseline",
        level: "Info",
        cwe: "Safe",
        description: "No common critical vulnerabilities detected in initial static analysis.",
      });
    }

    // Quick calculation
    const finalScore = Math.max(0, Math.min(100, score));

    res.json({
      score: finalScore,
      issues,
      suggestion,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Failed to analyze code." });
  }
});

// 4. Stripe Connect onboarding & status
app.post("/api/connect/onboard/:mentorId", async (req, res) => {
  const mentor = findMentor(req.params.mentorId);
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });
  try {
    res.json({ url: await onboardMentor(mentor, APP_URL) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/connect/status/:mentorId", async (req, res) => {
  const accountId = connectedAccountFor(req.params.mentorId);
  if (!accountId) return res.json({ connected: false });
  res.json({ connected: true, accountId, ...(await accountStatus(accountId)) });
});

// 5. Booking checkout
app.post("/api/book/:mentorId", async (req, res) => {
  const mentor = findMentor(req.params.mentorId);
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });
  const accountId = connectedAccountFor(mentor.id) || `demo_${mentor.id}`;
  try {
    res.json({ url: await createBookingCheckout(mentor, accountId, APP_URL) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🛡️  CyberMentor running at ${APP_URL}`);
  console.log(`💡 Mode: Defensive Cybersecurity Learning Network + Static Vulnerability Scanner`);
  console.log(`⚡ Stripe Connect: ${stripeEnabled ? "Live Test Mode" : "Demo Mock Mode"}`);
});
