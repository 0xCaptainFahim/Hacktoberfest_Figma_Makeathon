// State management
const state = {
  history: [],
  query: '',
  detectedSkills: [],
  matchedMentors: [],
  allMentors: [],
  latencyMs: null
};

// Helper functions
const $ = (id) => document.getElementById(id);

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('');
}

// Builds an element with text set via textContent
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Message rendering
function addMessage(role, text) {
  const messageRow = document.createElement('div');
  messageRow.className = `message-row ${role}`;

  if (role === 'assistant') {
    const avatar = document.createElement('span');
    avatar.className = 'assistant-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = '⌬';
    messageRow.appendChild(avatar);
  }

  const bubble = document.createElement('p');
  bubble.className = 'message-bubble';
  bubble.textContent = text;
  messageRow.appendChild(bubble);

  $('messages').appendChild(messageRow);
  $('messages').scrollTop = $('messages').scrollHeight;
}

// Mentor card rendering
function renderMentorCard(mentor) {
  const card = el('article', 'mentor-card');

  const avatar = el('span', 'mentor-avatar', getInitials(mentor.name));
  avatar.setAttribute('aria-hidden', 'true');

  const nameBlock = el('div');
  nameBlock.append(el('h3', '', mentor.name), el('p', '', mentor.title));

  const identity = el('div', 'mentor-identity');
  identity.append(avatar, nameBlock);

  const price = el('strong', 'price', `$${mentor.priceUsd} `);
  price.appendChild(el('span', '', '/session'));

  const top = el('div', 'mentor-top');
  top.append(identity, price);

  const skillList = el('div', 'skill-list');
  mentor.skills.forEach((skill) => skillList.appendChild(el('span', 'skill-tag', skill)));

  const arrow = el('span', '', '→');
  arrow.setAttribute('aria-hidden', 'true');
  const bookButton = el('button', 'book-button', 'Book session ');
  bookButton.type = 'button';
  bookButton.dataset.id = mentor.id;
  bookButton.appendChild(arrow);
  bookButton.onclick = () => bookMentor(mentor.id);

  card.append(top, el('p', 'mentor-bio', mentor.bio), skillList, bookButton);

  return card;
}

function renderMentorList(mentors, isMatched = false) {
  const mentorList = $('mentor-list');
  const matchesContainer = $('matches-container');

  if (isMatched && mentors.length === 0) {
    matchesContainer.innerHTML = `
      <div class="matches-heading">
        <div>
          <span class="eyebrow">Defensive Matches</span>
          <h2 id="matches-heading">Matched Mentors</h2>
        </div>
        <span class="match-count">0 matches</span>
      </div>
      <div class="mentor-list">
        <div class="empty-state">
          <span aria-hidden="true">⌕</span>
          <h3>No direct matches found</h3>
          <p>Try asking about OWASP, Threat Modeling, IAM, SIEM, Incident Response, or AI Security.</p>
        </div>
      </div>
    `;
    return;
  }

  if (isMatched) {
    matchesContainer.innerHTML = `
      <div class="matches-heading">
        <div>
          <span class="eyebrow">Recommended Experts</span>
          <h2 id="matches-heading">Matched Mentors</h2>
        </div>
        <span class="match-count">${mentors.length} ${mentors.length === 1 ? 'match' : 'matches'}</span>
      </div>
      <div class="mentor-list" id="mentor-list"></div>
    `;
  } else if (mentorList) {
    mentorList.innerHTML = '';
  }

  const listElement = $('mentor-list');
  if (listElement) {
    mentors.forEach(mentor => {
      listElement.appendChild(renderMentorCard(mentor));
    });
  }
}

// Booking
async function bookMentor(mentorId) {
  try {
    const res = await fetch(`/api/book/${mentorId}`, { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      location.href = data.url;
    } else {
      alert(data.error || 'Failed to initiate booking');
    }
  } catch (error) {
    alert('Failed to book session. Please try again.');
  }
}

// Chat submission
let chatRequest = 0;
async function submitChat() {
  const input = $('mentor-search');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  addMessage('user', text);
  state.history.push({ role: 'user', content: text });
  const requestId = ++chatRequest;

  $('detected-skills-text').textContent = 'analyzing...';
  $('latency-text').textContent = 'AI analysis: ...';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: state.history }),
    });

    const data = await res.json();
    if (requestId !== chatRequest) return;

    if (data.error) {
      addMessage('assistant', `Error: ${data.error}`);
      $('detected-skills-text').textContent = 'error';
      $('latency-text').textContent = 'AI analysis: -- ms';
      return;
    }

    state.query = text;
    state.detectedSkills = data.skills || [];
    state.matchedMentors = data.mentors || [];
    state.latencyMs = data.cerebrasLatencyMs;

    addMessage('assistant', data.reply);
    state.history.push({ role: 'assistant', content: data.reply });

    $('detected-skills-text').textContent =
      state.detectedSkills.length ? state.detectedSkills.join(', ') : 'none detected';
    $('latency-text').textContent = `AI analysis: ${state.latencyMs || '--'} ms`;

    renderMentorList(state.matchedMentors, true);

  } catch (error) {
    if (requestId !== chatRequest) return;
    addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    $('detected-skills-text').textContent = 'error';
    $('latency-text').textContent = 'AI analysis: -- ms';
  }
}

$('chat-form').onsubmit = (e) => {
  e.preventDefault();
  submitChat();
};

document.querySelectorAll('.demo-prompt').forEach((button) => {
  button.onclick = () => {
    $('mentor-search').value = button.dataset.prompt || '';
    submitChat();
  };
});

// Load all mentors
async function loadAllMentors() {
  try {
    const res = await fetch('/api/mentors');
    const mentors = await res.json();
    state.allMentors = mentors;

    if ($('total-mentors-count')) {
      $('total-mentors-count').textContent = `${mentors.length} mentors`;
    }
    renderMentorList(mentors, false);
  } catch (error) {
    if ($('total-mentors-count')) {
      $('total-mentors-count').textContent = 'Error loading';
    }
  }
}

const CYBER_GREETING = "Hello! I am CyberMentor. Tell me what defensive cybersecurity skill you want to learn (e.g., OWASP, Cloud IAM, Threat Modeling, SOC Incident Response, or AI Security) and I will match you with the right mentor.";

const browseMatchesHTML = `
  <div class="initial-matches">
    <span class="initial-matches-icon" aria-hidden="true">⌬</span>
    <h2 id="matches-heading">Your matches will appear here</h2>
    <p>Tell the assistant what defensive cybersecurity skill you want to master</p>
  </div>
  <div class="browse-heading">
    <div>
      <span class="eyebrow">Defensive Security Marketplace</span>
      <h3>Browse all mentors</h3>
    </div>
    <span id="total-mentors-count"></span>
  </div>
  <div class="mentor-list" id="mentor-list"></div>
`;

function showAllMentors() {
  $('matches-container').innerHTML = browseMatchesHTML;
  if ($('total-mentors-count')) {
    $('total-mentors-count').textContent = state.allMentors.length
      ? `${state.allMentors.length} mentors`
      : 'Loading...';
  }
  if (state.allMentors.length) renderMentorList(state.allMentors, false);
}

function clearChat() {
  chatRequest += 1;
  state.history = [];
  state.query = '';
  state.detectedSkills = [];
  state.matchedMentors = [];
  state.latencyMs = null;
  $('mentor-search').value = '';
  $('messages').replaceChildren();
  $('detected-skills-text').textContent = 'waiting for input';
  $('latency-text').textContent = 'AI analysis: -- ms';
  showAllMentors();
  addMessage('assistant', CYBER_GREETING);
}

if ($('clear-chat')) $('clear-chat').onclick = clearChat;

// --- Tab Navigation Switcher ---
const tabMentors = $('tab-mentors');
const tabScanner = $('tab-scanner');
const mentorsView = $('mentors-view');
const scannerView = $('scanner-view');

function switchTab(target) {
  if (target === 'mentors') {
    tabMentors.classList.add('active');
    tabMentors.setAttribute('aria-selected', 'true');
    tabScanner.classList.remove('active');
    tabScanner.setAttribute('aria-selected', 'false');
    mentorsView.style.display = 'grid';
    scannerView.style.display = 'none';
  } else {
    tabScanner.classList.add('active');
    tabScanner.setAttribute('aria-selected', 'true');
    tabMentors.classList.remove('active');
    tabMentors.setAttribute('aria-selected', 'false');
    mentorsView.style.display = 'none';
    scannerView.style.display = 'grid';
  }
}

if (tabMentors) tabMentors.onclick = () => switchTab('mentors');
if (tabScanner) tabScanner.onclick = () => switchTab('scanner');
if ($('brand-logo')) $('brand-logo').onclick = () => switchTab('mentors');

// --- Code Vulnerability Scanner Presets & Logic ---
const PRESETS = {
  sqli: `// Express route with SQL Injection vulnerability
app.get('/api/user', async (req, res) => {
  const userId = req.query.id;
  const sql = \`SELECT * FROM users WHERE id = \${userId}\`;
  const [rows] = await db.query(sql);
  res.json(rows);
});`,
  xss: `// DOM XSS vulnerability
function displayGreeting(username) {
  const container = document.getElementById('user-greeting');
  // Untrusted input directly written to innerHTML
  container.innerHTML = "<h1>Welcome, " + username + "!</h1>";
}`,
  jwt: `// Insecure JWT signing and validation
const jwt = require('jsonwebtoken');

function issueToken(user) {
  // Hardcoded weak secret
  return jwt.sign({ id: user.id }, "secret", { expiresIn: '1h' });
}

function verifyUser(token) {
  // Bypassing token expiration validation
  return jwt.verify(token, "secret", { ignoreExpiration: true });
}`,
  cmd: `// Arbitrary Command Injection vulnerability
const { exec } = require('child_process');

app.post('/api/ping', (req, res) => {
  const host = req.body.host;
  // Unsanitized host parameter concatenated into shell
  exec(\`ping -c 4 \${host}\`, (err, stdout) => {
    res.send(stdout);
  });
});`,
  clean: `// Secure defensive baseline
const DOMPurify = require('dompurify');

app.get('/api/profile', async (req, res) => {
  const userId = parseInt(req.query.id, 10);
  if (isNaN(userId)) return res.status(400).send("Invalid ID");

  // Secure parameterized query
  const [user] = await db.query('SELECT username, email FROM users WHERE id = ?', [userId]);
  res.json({ user });
});`
};

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.onclick = () => {
    const key = btn.dataset.preset;
    if (PRESETS[key]) {
      $('code-input').value = PRESETS[key];
    }
  };
});

if ($('clear-code-btn')) {
  $('clear-code-btn').onclick = () => {
    $('code-input').value = '';
  };
}

if ($('scan-code-btn')) {
  $('scan-code-btn').onclick = async () => {
    const code = $('code-input').value.trim();
    if (!code) {
      alert("Please enter or paste a code snippet to analyze.");
      return;
    }

    const btn = $('scan-code-btn');
    btn.disabled = true;
    btn.textContent = "Scanning...";

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      btn.disabled = false;
      btn.textContent = "⚡ Run Security Audit";

      renderAuditResults(data);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = "⚡ Run Security Audit";
      alert("Scan failed. Ensure the server is running.");
    }
  };
}

function renderAuditResults(data) {
  const container = $('results-container');
  const scoreBadge = $('score-badge');
  const score = data.score ?? 100;

  // Update Score Badge
  scoreBadge.textContent = `Security Score: ${score}/100`;
  scoreBadge.className = 'score-badge ' + (score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low');

  container.innerHTML = '';

  // Render Issues
  if (data.issues && data.issues.length > 0) {
    data.issues.forEach(issue => {
      const item = el('div', 'issue-item');
      
      const header = el('div', 'issue-header');
      header.appendChild(el('h4', 'issue-title', issue.title));

      const pills = el('div', 'issue-pills');
      if (issue.cwe) pills.appendChild(el('span', 'cwe-tag', issue.cwe));
      
      const sevClass = (issue.level || 'info').toLowerCase();
      pills.appendChild(el('span', `severity-pill ${sevClass}`, issue.level || 'Info'));
      header.appendChild(pills);

      item.appendChild(header);
      item.appendChild(el('p', 'issue-desc', issue.description));
      container.appendChild(item);
    });
  }

  // Render Remediation Suggestion
  if (data.suggestion) {
    const remSection = el('div', 'remediation-section');
    const remHeader = el('div', 'remediation-header');
    remHeader.appendChild(el('strong', '', '🛡️ Recommended Defensive Patch'));

    const copyBtn = el('button', 'copy-btn', 'Copy Patch');
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(data.suggestion);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy Patch'), 2000);
    };
    remHeader.appendChild(copyBtn);

    const codeBlock = el('pre', 'remediation-code', data.suggestion);
    remSection.appendChild(remHeader);
    remSection.appendChild(codeBlock);
    container.appendChild(remSection);
  }
}

// Payment page result handling
function showPaymentResult(success, mentorId) {
  document.documentElement.classList.add('show-payment');
  const icon = $('result-icon');
  icon.className = `result-icon ${success ? 'success' : 'cancelled'}`;
  icon.textContent = success ? '✓' : '✕';
  $('result-title').textContent = success ? 'Payment successful' : 'Payment cancelled';
  $('result-message').textContent = success
    ? 'Payment succeeded (test mode). Your session is confirmed!'
    : 'Payment cancelled. No charge was made.';

  const receipt = $('booking-receipt');
  receipt.hidden = true;
  if (!mentorId) return;

  fetch('/api/mentors')
    .then((res) => res.json())
    .then((mentors) => {
      const mentor = mentors.find((item) => item.id === mentorId);
      if (!mentor) return;
      $('receipt-mentor').textContent = `Session with ${mentor.name}`;
      $('receipt-price').textContent = `$${mentor.priceUsd}`;
      receipt.hidden = false;
    })
    .catch(() => {});
}

// Initialize
addMessage('assistant', CYBER_GREETING);

const params = new URLSearchParams(location.search);
if (params.has('paid') || params.has('cancelled')) {
  showPaymentResult(params.has('paid'), params.get('paid') || params.get('cancelled'));
}

loadAllMentors();
