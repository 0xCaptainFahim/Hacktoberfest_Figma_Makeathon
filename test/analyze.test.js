import test from "node:test";
import assert from "node:assert/strict";

// Test the vulnerability rules logic
function analyzeCode(code) {
  const lowerCode = (code || "").toLowerCase();
  const issues = [];
  let score = 100;

  if (lowerCode.includes("select") && (lowerCode.includes("${") || lowerCode.includes("+ req.") || lowerCode.includes("+ user"))) {
    issues.push({ title: "SQL Injection (SQLi)", level: "Critical" });
    score -= 40;
  }
  if (lowerCode.includes("innerhtml") || lowerCode.includes("document.write")) {
    issues.push({ title: "Cross-Site Scripting (DOM XSS)", level: "Critical" });
    score -= 35;
  }
  if (lowerCode.includes("jwt.verify") && lowerCode.includes("ignoreexpiration")) {
    issues.push({ title: "Insecure JWT Validation", level: "Warning" });
    score -= 20;
  }
  if (lowerCode.includes("jwt.sign") && (lowerCode.includes("'secret'") || lowerCode.includes('"secret"'))) {
    issues.push({ title: "Hardcoded Weak JWT Secret", level: "Critical" });
    score -= 30;
  }
  if ((lowerCode.includes("exec(") || lowerCode.includes("execsync(")) && (lowerCode.includes("req.") || lowerCode.includes("ping") || lowerCode.includes("${"))) {
    issues.push({ title: "Command Injection (RCE)", level: "Critical" });
    score -= 45;
  }
  if (lowerCode.includes("node-serialize") || lowerCode.includes("unserialize")) {
    issues.push({ title: "Insecure Object Deserialization", level: "Critical" });
    score -= 50;
  }

  return { score: Math.max(0, Math.min(100, score)), issues };
}

test("detects SQL injection and lowers security score", () => {
  const code = 'const query = `SELECT * FROM users WHERE id = ${req.query.id}`;';
  const result = analyzeCode(code);
  assert.equal(result.issues.length, 1);
  assert.equal(result.issues[0].title, "SQL Injection (SQLi)");
  assert.equal(result.score, 60);
});

test("detects multiple critical vulnerabilities", () => {
  const code = 'element.innerHTML = userInput; const q = "SELECT * FROM t WHERE u = " + req.name;';
  const result = analyzeCode(code);
  assert.equal(result.issues.length, 2);
  assert.equal(result.score, 25);
});

test("passes clean code with score 100", () => {
  const code = "const sum = (a, b) => a + b;";
  const result = analyzeCode(code);
  assert.equal(result.issues.length, 0);
  assert.equal(result.score, 100);
});
