import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Pure local static analysis demo (AI model removed)
    const lowerCode = code.toLowerCase();
    let issues = [];
    let score = 100;
    let suggestion = "// No vulnerabilities found in static analysis.";

    if (lowerCode.includes('select') && lowerCode.includes('${')) {
      issues.push({ title: "SQL Injection", level: "Critical", description: "Unsanitized user input is directly concatenated into a SQL query. This allows attackers to manipulate the database." });
      score -= 40;
      suggestion = "const userId = req.query.id;\n// Use parameterized queries to prevent SQLi\ndb.query('SELECT * FROM users WHERE id = ?', [userId]);";
    }
    if (lowerCode.includes('innerhtml') || lowerCode.includes('document.write')) {
      issues.push({ title: "Cross-Site Scripting (XSS)", level: "Critical", description: "Directly writing unsanitized input to the DOM allows execution of malicious scripts." });
      score -= 40;
      suggestion = "const sanitizedInput = DOMPurify.sanitize(userInput);\nelement.textContent = sanitizedInput; // Use textContent instead of innerHTML";
    }
    if (lowerCode.includes('jwt.verify') && lowerCode.includes('ignoreexpiration')) {
      issues.push({ title: "Insecure JWT Validation", level: "Warning", description: "JWT tokens are not being properly validated for expiration or algorithm." });
      score -= 20;
      suggestion = "jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] });";
    }
    if (lowerCode.includes('jwt.sign') && lowerCode.includes("'secret'")) {
      issues.push({ title: "Weak JWT Secret", level: "Critical", description: "JWT is signed with a hardcoded, weak secret. Tokens can be easily forged." });
      score -= 30;
      suggestion = "return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });";
    }
    if (lowerCode.includes('exec') && lowerCode.includes('ping')) {
      issues.push({ title: "Command Injection", level: "Critical", description: "Unsanitized user input is passed directly to a system shell command execution." });
      score -= 50;
      suggestion = "const { execFile } = require('child_process');\n// Use execFile with arguments array instead of exec\nexecFile('ping', ['-c', '4', domain], (err, stdout) => { ... });";
    }
    if (lowerCode.includes('node-serialize') || lowerCode.includes('unserialize')) {
      issues.push({ title: "Insecure Deserialization", level: "Critical", description: "Deserializing untrusted data can lead to Remote Code Execution (RCE)." });
      score -= 50;
      suggestion = "// Do not use node-serialize with untrusted input.\n// Use safe JSON parsing instead:\nconst userObj = JSON.parse(req.cookies.profile);";
    }

    if (issues.length === 0) {
      issues.push({ title: "Clean Code", level: "Info", description: "Basic static analysis found no critical issues." });
    }

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      score: Math.max(0, score),
      issues: issues,
      suggestion: suggestion
    });
  } catch (error: any) {
    console.error('Analyze error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
