// Chat reply — written by Qwen on Cerebras or resilient built-in CyberMentor assistant.
import { cerebras, MODEL, stripThink } from "./cerebras.js";

const SYSTEM_PROMPT = `You are CyberMentor, a friendly assistant that helps developers in Bangladesh
learn defensive cybersecurity and find a mentor. Keep replies short (2-4 sentences). When mentors
are provided to you, introduce them briefly and invite the user to book one. Keep advice educational,
legal, and focused on authorized systems. Never invent mentors.`;

export async function writeReply(history, mentors = []) {
  if (cerebras && MODEL) {
    try {
      const context = mentors.length
        ? `Matched mentors (from our database):\n${mentors
            .map((m) => `- ${m.name}, ${m.title}, $${m.priceUsd}/session: ${m.bio}`)
            .join("\n")}`
        : "No mentors matched yet. Ask what the user wants to learn.";

      const res = await cerebras.chat.completions.create({
        model: MODEL,
        messages: [{ role: "system", content: `${SYSTEM_PROMPT}\n\n${context}` }, ...history],
      });
      return stripThink(res.choices[0].message.content).trim();
    } catch (err) {
      console.warn("Cerebras reply error, using resilient response generator:", err.message);
    }
  }

  // Resilient defensive assistant reply
  if (mentors.length > 0) {
    const mentorNames = mentors.map((m) => `${m.name} (${m.title})`).join(", ");
    return `Great focus! For mastering defensive security in this area, I recommend connecting with ${mentorNames}. They have hands-on experience securing real-world systems. Would you like to book a 1:1 session?`;
  }

  return "Welcome to CyberMentor! What defensive cybersecurity skill or domain would you like to explore today? You can ask about OWASP Top 10, Cloud IAM, Threat Modeling, Incident Response, SIEM, or AI Security.";
}
