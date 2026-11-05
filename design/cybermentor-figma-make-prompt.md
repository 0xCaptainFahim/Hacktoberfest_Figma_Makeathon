# CyberMentor — Official Figma Make Prompt & Design Specification

Use this complete prompt directly inside **Figma Make** (or Claude / Cursor with Figma plugin) to generate the complete **CyberMentor** design system and responsive screens.

---

## 🎨 Master Figma Make Prompt

> **Design a responsive, dark-mode cybersecurity web application called "CyberMentor"** — an open-source defensive cybersecurity learning network and vulnerability code scanner for developers.
>
> ### Global Visual Style:
> - **Theme**: High-end cyber defensive dark mode.
> - **Color Tokens**:
>   - Primary Background: `#07131A` (Deep Cyber Navy)
>   - Surface / Panels: `#0C2029` (Dark Slate Glass)
>   - Accent Primary: `#20D7B0` (Vibrant Cyber Teal)
>   - Accent Glow: `rgba(32, 215, 176, 0.15)`
>   - Text Primary: `#EFFCF7`
>   - Text Muted: `#9CB5B7`
>   - Border: `#1B3B45`
>   - Severity Colors: Critical `#F87171` (Soft Red), Warning `#F5B94D` (Amber), Success/Mint `#6EE7B7` / `#69E18C`.
> - **Typography**: Inter (Editorial tech scale: 10px eyebrow, 13px body, 15px price, 24px panel title, 32px display heading).
> - **Layouts Required**:
>   1. **Desktop Home (1440px wide)**:
>      - **Header**: Shield/Hex logo brandmark `⌬ CyberMentor`, centered pill navigation tabs with variants for `[🛡️ Mentorship Network]` (active) and `[⚡ Vulnerability Scanner]` (inactive), and right-aligned link `Security expert? Connect payouts →`.
>      - **Left Chat Panel (`ChatPanel`)**: Heading "What do you want to secure?", live green "Online" pill, message bubble history (`assistant` in `#102C35` with `⌬` avatar, `user` in `#20D7B0`), input composer with "Clear chat" and "Send ↗", live skill detection row with pulsing teal dot `Detected Skills:` and green latency pill `AI analysis: 12 ms`.
>      - **Right Matches Panel (`MatchesPanel`)**: Top section "Personalized for you - Matched mentors", 2-column grid of mentor cards (`MentorCard`).
>   2. **Vulnerability Scanner Screen (1440px wide)**:
>      - Active tab `[⚡ Vulnerability Scanner]`.
>      - **Left Code Audit Panel (`ScannerPanel`)**: Preset pill buttons `[SQL Injection]`, `[DOM XSS]`, `[Weak JWT Secret]`, `[Command Injection]`, `[Clean Code]`. Monospace dark code textarea with syntax highlights (`#A5F3FC`). Teal CTA `[⚡ Run Security Audit]`.
>      - **Right Audit Report Panel (`ScannerResultsPanel`)**: Circular Security Score Dial `Score: 60/100 (High Risk)`, list of vulnerability cards (`IssueCard`) with severity badges (`CRITICAL`, `WARNING`), CWE tags (`CWE-89`), vulnerability explanation, and a highlighted green box with "🛡️ Recommended Defensive Patch" and a "Copy Patch" button.
>   3. **Mentor Payouts Dashboard (1440px wide / `narrow-page` 1040px)**:
>      - Payout summary metrics cards (Total mentors, Ready for payouts, Need attention).
>      - Mentor payout rows (`PayoutRow`) with status pills (`Ready to receive payments` in green, `Onboarding incomplete` in amber, `Not connected` in gray) and `[Connect with Stripe]` button.
>   4. **Mobile Layout (390px wide)**:
>      - Single-column stacked layout with compact header, 420px touch-friendly chat box over cards, and single-column mentor/audit results.
>
> ### Components & Auto Layout:
> - Build as reusable Figma components with Auto Layout:
>   - `BrandHeader` (Desktop & Mobile variants)
>   - `NavTabs` (Default & Active states)
>   - `ChatPanel` (Input, Active, Typing states)
>   - `MentorCard` (Default & Hover with cyan border glow, showing Initials avatar, Name, Title, Price `/session`, Bio, Skill pills, and `Book session →` button)
>   - `SkillTag` (Pill variant, `#07131A` background with `#1B3B45` border)
>   - `StatusPill` (Ready, Incomplete, Not-Connected variants)
>   - `ScoreGauge` (High >80, Medium 50-80, Low <50)
>   - `IssueCard` (Critical, Warning, Info variants with CWE tag)
> - All texts must remain strictly educational, ethical, and defensive (no offensive hacking instructions).

---

## 📐 Layer Naming Map for Code Sync

Maintain these exact layer names so Figma styles and components map cleanly to `public/styles.css` and `public/index.html`:

| Figma Frame / Layer | HTML Element / Class | CSS Selector |
|---|---|---|
| `Header` | `<header class="header">` | `.header` |
| `BrandLogo` | `<button class="brand">` | `.brand` |
| `NavTabs` | `<nav class="nav-tabs">` | `.nav-tabs` |
| `ChatPanel` | `<section class="chat-panel">` | `.chat-panel` |
| `MessageBubble` | `<p class="message-bubble">` | `.message-bubble` |
| `MentorCard` | `<article class="mentor-card">` | `.mentor-card` |
| `SkillTag` | `<span class="skill-tag">` | `.skill-tag` |
| `BookButton` | `<button class="book-button">` | `.book-button` |
| `ScannerPanel` | `<section class="scanner-panel">` | `.scanner-panel` |
| `CodeEditor` | `<textarea id="code-input">` | `.code-editor-wrapper textarea` |
| `ScoreBadge` | `<span class="score-badge">` | `.score-badge` |
| `IssueCard` | `<div class="issue-item">` | `.issue-item` |
| `SeverityPill` | `<span class="severity-pill">` | `.severity-pill` |
| `RemediationBlock` | `<div class="remediation-section">` | `.remediation-section` |
| `StatusPill` | `<span class="status-pill">` | `.status-pill` |
