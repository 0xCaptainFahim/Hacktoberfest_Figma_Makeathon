import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, codeContext } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Pure local chat demo (AI model removed)
    const msg = message.toLowerCase();
    let reply = "I am the local static Security Copilot. I can provide basic syntax fixes for common vulnerabilities.";
    
    if (msg.includes('hello') || msg.includes('hi')) {
      reply = "Hello! I am the local Security Copilot demo. Load a code snippet and ask me how to fix it!";
    } else if (msg.includes('fix') || msg.includes('how')) {
      reply = "To fix this vulnerability, ensure you are sanitizing inputs. If it's a database query, use parameterized queries. If it's shell execution, use execFile. If it's deserialization, use JSON.parse().";
    } else if (msg.includes('sql')) {
      reply = "SQL Injection occurs when user data is mixed with query structure. ALWAYS use parameter binding (e.g. `query('... WHERE id = ?', [id])`) instead of template literals.";
    } else if (msg.includes('xss')) {
      reply = "XSS can be mitigated by properly escaping data before rendering. In React, use standard JSX which auto-escapes, and avoid dangerouslySetInnerHTML.";
    } else if (msg.includes('cmd') || msg.includes('command') || msg.includes('exec')) {
      reply = "Command Injection happens when unsanitized input is passed to system commands like `exec`. To fix, use `execFile` or `spawn` which separate the command from its arguments, preventing shell interpolation.";
    } else if (msg.includes('deserialize') || msg.includes('serialize')) {
      reply = "Insecure Deserialization can lead to Remote Code Execution if malicious objects are reconstructed. Never use libraries like `node-serialize` with user input. Stick to safe formats like `JSON.parse`.";
    } else if (msg.includes('jwt')) {
      reply = "For secure JWTs: Always use strong secrets, enforce expiration times (expiresIn), and strictly verify the signing algorithm.";
    } else {
      reply = "Please ask me about specific vulnerabilities like SQLi, XSS, JWT, Command Injection, or Deserialization.";
    }

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 600));

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ reply: 'An internal error occurred.' }, { status: 500 });
  }
}
