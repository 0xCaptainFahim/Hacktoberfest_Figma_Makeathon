// Run with: npm run check
// Pings each provider once so you know your keys and model IDs work.
const ok = (name, msg) => console.log(`  [OK]   ${name}: ${msg}`);
const bad = (name, msg) => console.log(`  [FAIL] ${name}: ${msg}`);
const info = (name, msg) => console.log(`  [INFO] ${name}: ${msg}`);

console.log("🛡️  Checking CyberMentor environment & keys...\n");

// 1. Check Cerebras SDK & Key
const cerebrasKey = process.env.CEREBRAS_API_KEY;
const cerebrasModel = process.env.CEREBRAS_MODEL || "qwen-3-32b";

if (!cerebrasKey || cerebrasKey === "csk-...") {
  info("Qwen (Cerebras)", "Key not configured. Running with built-in resilient defensive cybersecurity AI engine.");
} else {
  try {
    const Cerebras = (await import("@cerebras/cerebras_cloud_sdk")).default;
    const client = new Cerebras({ apiKey: cerebrasKey });
    const t = Date.now();
    const r = await client.chat.completions.create({
      model: cerebrasModel,
      messages: [{ role: "user", content: "Reply with the word ready. /no_think" }],
    });
    ok("Qwen (Cerebras)", `${cerebrasModel} replied in ${Date.now() - t} ms -> "${r.choices[0].message.content.trim().slice(0, 40)}"`);
  } catch (e) {
    bad("Qwen (Cerebras)", e.message);
  }
}

// 2. Check Stripe Key
const sk = process.env.STRIPE_SECRET_KEY || "";
if (!sk.startsWith("sk_test_")) {
  info("Stripe Connect", "Test key not set. Running in demo mode (instant checkout simulation enabled).");
} else {
  try {
    const Stripe = (await import("stripe")).default;
    const acct = await new Stripe(sk).accounts.retrieve();
    ok("Stripe", `test mode, platform account ${acct.id}`);
  } catch (e) {
    bad("Stripe", e.message);
  }
}

console.log("\n✨ System check complete. Run 'npm run dev' to launch CyberMentor!");
