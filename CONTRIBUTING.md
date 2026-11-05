# Contributing to CyberMentor 🛡️🎃

Thank you for your interest in contributing to **CyberMentor**! This project is an official open-source participant in **Hacktoberfest 2026**.

Whether you're fixing a bug, adding new vulnerability detection patterns, enhancing the UI, or improving documentation, your contributions are welcome!

---

## 🎃 Hacktoberfest Participation Rules

1. Pull requests must be submitted during October (or Hacktoberfest official event period).
2. Pull requests must contain meaningful, quality contributions (no spam PRs, typo-only changes, or automated bot churn).
3. Check the `hacktoberfest` or `good first issue` labels on our issue tracker.
4. Each PR should address a single issue or feature.

---

## 🛠️ Development Setup

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/mentor-match.git
   cd mentor-match
   ```
2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the local dev server**:
   ```bash
   npm run dev
   ```
5. **Run tests**:
   ```bash
   npm test
   ```
   Ensure all tests pass before submitting your PR!

---

## 🎯 High-Value Hacktoberfest Areas

- **Vulnerability Scanner Expansion**:
  - Add detection for SSRF (Server-Side Request Forgery)
  - Add detection for Path Traversal (`../` or `res.sendFile(req.params.file)`)
  - Add detection for Insecure CORS configuration (`Access-Control-Allow-Origin: *`)
  - Add corresponding unit tests in `test/analyze.test.js`
- **Figma & Design Tokens**:
  - Keep CSS variables aligned with `design/FIGMA_SPECIFICATION.md`
- **Mentor Catalog**:
  - Expand `src/mentors.json` with defensive cybersecurity specialties (SOC, Blue Team, DevSecOps, GRC)

---

## 📝 Pull Request Checklist

Before opening your pull request, make sure:
- [ ] Code passes all tests: `npm test`
- [ ] Code follows existing formatting and architectural guidelines
- [ ] No secrets, live API keys, or credentials are committed
- [ ] A clear description of the change and issue reference is included

Happy Hacking! 🚀
