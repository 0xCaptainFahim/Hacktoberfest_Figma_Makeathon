// Qwen on Cerebras Cloud — fast structured extraction for matching, with resilient local fallback.
import { parseSkills, normalizeSkill } from "./skills.js";

export { stripThink } from "./skills.js";

let cerebrasClient = null;
const apiKey = process.env.CEREBRAS_API_KEY;
export const MODEL = process.env.CEREBRAS_MODEL || "qwen-3-32b";

// Dynamically attempt to load Cerebras SDK if key is provided
if (apiKey && apiKey !== "csk-...") {
  try {
    const Cerebras = (await import("@cerebras/cerebras_cloud_sdk")).default;
    cerebrasClient = new Cerebras({ apiKey });
  } catch {
    // SDK optional; falls back to built-in cybersecurity skill detection engine
  }
}

export const cerebras = cerebrasClient;

const EXTRACT_PROMPT = `Extract the defensive cybersecurity skills the user wants to learn from their message.
Reply with ONLY a JSON object like {"skills": ["threat modeling", "owasp"]}, lowercase, no other text.
If nothing technical is mentioned, reply {"skills": []}. /no_think`;

const CYBER_SKILL_PATTERNS = [
  { match: /\b(aws|amazon web services|cloud)\b/i, skill: "aws" },
  { match: /\b(terraform|iac|infrastructure as code)\b/i, skill: "terraform" },
  { match: /\b(iam|identity|access control|roles|permissions)\b/i, skill: "iam" },
  { match: /\b(devsecops|ci\/cd security|pipeline security)\b/i, skill: "devsecops" },
  { match: /\b(owasp|top 10|web vulns?|xss|sql injection|csrf|ssrf)\b/i, skill: "owasp" },
  { match: /\b(threat model(ing)?|stride|pasta|threats?)\b/i, skill: "threat modeling" },
  { match: /\b(web security|appsec|application security)\b/i, skill: "web security" },
  { match: /\b(secure code|code review|sast|dast|secure coding)\b/i, skill: "secure code" },
  { match: /\b(python|scripting|automation|security tools)\b/i, skill: "python" },
  { match: /\b(siem|wazuh|elastic security|sentinel)\b/i, skill: "siem" },
  { match: /\b(incident response|dfir|forensics|containment)\b/i, skill: "incident response" },
  { match: /\b(splunk|log analysis|logging|syslog|siem logs)\b/i, skill: "splunk" },
  { match: /\b(soc|security operations|blue team|triaging)\b/i, skill: "log analysis" },
  { match: /\b(privacy|gdpr|ccpa|data protection)\b/i, skill: "privacy" },
  { match: /\b(risk assessment|risk|grc|iso 27001|soc 2|audit)\b/i, skill: "risk assessment" },
  { match: /\b(compliance|governance|security policy|standards)\b/i, skill: "compliance" },
  { match: /\b(security awareness|phishing|social engineering)\b/i, skill: "security awareness" },
  { match: /\b(ai security|llm security|ai safety|jailbreak)\b/i, skill: "ai security" },
  { match: /\b(llm security|red teaming llms?|rag security)\b/i, skill: "llm security" },
  { match: /\b(prompt injection|indirect injection|prompt leaking)\b/i, skill: "prompt injection" },
  { match: /\b(docker|container security)\b/i, skill: "docker" },
  { match: /\b(kubernetes|k8s)\b/i, skill: "kubernetes" }
];

export async function extractSkills(message) {
  const started = Date.now();

  if (cerebrasClient && MODEL) {
    try {
      const res = await cerebrasClient.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: EXTRACT_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0,
      });
      const latencyMs = Date.now() - started;
      const skills = parseSkills(res.choices?.[0]?.message?.content);
      return { skills, latencyMs };
    } catch (err) {
      console.warn("Cerebras inference call failed, using built-in cybersecurity matcher:", err.message);
    }
  }

  // Built-in defensive cybersecurity extraction engine
  const detected = new Set();
  for (const { match, skill } of CYBER_SKILL_PATTERNS) {
    if (match.test(message)) {
      detected.add(normalizeSkill(skill));
    }
  }

  const latencyMs = Math.max(12, Date.now() - started);
  return { skills: Array.from(detected), latencyMs };
}
