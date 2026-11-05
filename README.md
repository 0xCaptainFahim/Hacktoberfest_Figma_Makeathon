# 🛡️ CyberMentor

> **Defensive Cybersecurity AI Learning Network & Vulnerability Code Scanner**  
> *An official open-source project ready for **Hacktoberfest 2026**.*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026%20Ready-ff5f00?style=for-the-badge&logo=hacktoberfest&logoColor=white)](https://hacktoberfest.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-20d7b0.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.6+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Qwen%20on%20Cerebras-4f46e5?style=for-the-badge)](https://cloud.cerebras.ai)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

---

## 🌟 What is CyberMentor?

**CyberMentor** is an open-source cybersecurity learning network and defensive security hub built for developers and security enthusiasts. It solves two critical challenges in cybersecurity education:

1. **Defensive Mentorship Matching (💬 AI Chat):** A learner types what defensive security skills they want to acquire (e.g., OWASP Top 10, Cloud IAM, Threat Modeling, Incident Response, SIEM, or AI Security). CyberMentor's fast AI engine extracts the core skills, matches them with vetted cybersecurity mentors, and facilitates 1:1 session bookings with Stripe Connect payouts.
2. **Static Vulnerability Scanner (⚡ Code Security Audit):** An interactive defensive code analyzer that scans backend and frontend code for critical security flaws (SQL Injection, DOM XSS, Weak JWT Secrets, Command Injection, Insecure Deserialization), computes a real-time **Security Score (0–100)**, and provides safe, defensive code remediation patches with one click.

---

## 🏗️ Architecture

```
                                  ┌──────────────────────────┐
                                  │   CyberMentor Web UI     │
                                  │ (HTML5 / CSS3 / Vanilla) │
                                  └─────────────┬────────────┘
                                                │
                      ┌─────────────────────────┴────────────────────────┐
                      │                                                  │
                      ▼                                                  ▼
          [ 🛡️ Mentorship View ]                             [ ⚡ Vulnerability Scanner ]
                      │                                                  │
          POST /api/chat                                      POST /api/analyze
                      │                                                  │
                      ▼                                                  ▼
      ┌──────────────────────────────┐                   ┌──────────────────────────────┐
      │ Qwen on Cerebras Cloud       │                   │ Static Analysis Engine       │
      │ (Fast skill extraction &     │                   │ (Regex token matching, CWE   │
      │  defensive conversational    │                   │  classification, security    │
      │  assistant)                  │                   │  scoring, defensive patches) │
      └──────────────┬───────────────┘                   └──────────────────────────────┘
                     │
                     ▼
      ┌──────────────────────────────┐
      │ Mentor Matching Algorithm    │
      │ (Whole-token ranking against │
      │  cyber mentor database)      │
      └──────────────┬───────────────┘
                     │
                     ▼
      ┌──────────────────────────────┐
      │ Stripe Connect Payouts       │
      │ (1:1 session bookings &      │
      │  expert payout onboarding)   │
      └──────────────────────────────┘
```

---

## 🚀 Quick Start (Runs in 60 Seconds!)

CyberMentor is built with **zero external blockers** — if you do not have API keys yet, the application automatically runs with its built-in resilient defensive AI engine and demo Stripe mode!

### Prerequisites
- **Node.js**: v20.6 or higher
- **npm**: v9 or higher

### 1. Clone & Enter Directory
```bash
git clone https://github.com/mitul3737/mentor-match.git
cd mentor-match
```

### 2. Verify / Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**. That's it! 🎉

---

## 🔑 Optional Environment Keys (`.env`)

To connect to live external cloud providers, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port for the Express application server |
| `APP_URL` | `http://localhost:3000` | Base URL used for Stripe redirects |
| `CEREBRAS_API_KEY` | `""` | Cerebras Cloud API key for ultra-fast Qwen inference |
| `CEREBRAS_MODEL` | `qwen-3-32b` | Model ID hosted on Cerebras Inference |
| `STRIPE_SECRET_KEY` | `""` | Stripe secret key (`sk_test_...` only; live keys rejected) |
| `PLATFORM_FEE_PERCENT` | `10` | Percentage retained by the platform upon mentor booking |

To verify your keys anytime:
```bash
npm run check
```

---

## 🧪 Testing

CyberMentor features a strict zero-dependency test suite running on Node's native test runner:

```bash
npm test
```

All 13 unit tests verify:
- SQLi, XSS, and JWT vulnerability detection
- Security scoring calculations
- Chat input sanitization (dropping malicious roles and enforcing length bounds)
- Case-insensitive, whole-token defensive cybersecurity skill matching
- Cerebras think block stripping and JSON normalization

---

## 🎨 Figma Design & Design System

The CyberMentor UI was designed using **Figma Make** with Auto Layout and modular component variants:

- **Figma Make Prompt**: Located in [`design/cybermentor-figma-make-prompt.md`](design/cybermentor-figma-make-prompt.md). Use this prompt to recreate or extend the responsive interface in Figma.
- **Design Specification**: Detailed design tokens, hex codes, typography scale, and layout grid are in [`design/FIGMA_SPECIFICATION.md`](design/FIGMA_SPECIFICATION.md).

### Visual Tokens:
- **Background**: `#07131A` (Deep Cyber Navy)
- **Surface**: `#0C2029` (Dark Slate)
- **Accent**: `#20D7B0` (Cyber Teal)
- **Success / Mint**: `#69E18C` / `#6EE7B7`
- **Critical / Danger**: `#F87171`
- **Border**: `#1B3B45`

---

## 🎃 Hacktoberfest 2026 Guidelines

We welcome all open-source contributors during Hacktoberfest and throughout the year!

### Ways to Contribute:
1. **Add Vulnerability Rules**: Extend `/api/analyze` in `server.js` to detect additional CWEs (e.g., SSRF, Open Redirect, Path Traversal, Insecure CORS).
2. **Expand Mentor Specializations**: Add realistic defensive security mentors in `src/mentors.json`.
3. **UI & Accessibility Enhancements**: Improve keyboard accessibility, contrast ratios, or add export options for security audit reports.
4. **Docs & Localization**: Translate documentation or improve developer guides.

Please review our [**CONTRIBUTING.md**](CONTRIBUTING.md) and [**CODE_OF_CONDUCT.md**](CODE_OF_CONDUCT.md) before submitting a pull request.

---

## 👥 Authors & Maintainers

- **Md Shahriyar Al Mustakim Mitul** ([@mitul3737](https://github.com/mitul3737))
- **Fahim (Captain Fahim / Nothacker-Fahim)**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
