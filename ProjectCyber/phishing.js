const emails = [
  {
    id: 1,
    sender: 'security@paypal.com',
    displayName: 'PayPal Security',
    subject: 'Your account has been limited',
    time: '09:14',
    type: 'phishing',
    unread: true,
    body: `
      <p>Dear Valued Customer,</p><br>
      <p>We have noticed <strong>unusual activity</strong> on your PayPal account. To ensure your account security, we have <span style="color:var(--accent)">temporarily limited</span> access to your account.</p><br>
      <p>Please click the link below to verify your information within <strong>24 hours</strong> or your account will be permanently suspended:</p><br>
      <p><span class="email-link">http://paypa1-secure.verification-center.net/confirm?id=8472hgs</span></p><br>
      <p>Required information:</p>
      <p>• Full name & date of birth<br>• Credit card number<br>• Social Security Number</p><br>
      <p>Failure to act will result in permanent account closure.</p><br>
      <p>PayPal Security Team</p>
    `,
    redFlags: [
      'Domain is "paypa1-secure.verification-center.net" — not paypal.com',
      'Asks for SSN and credit card via email — PayPal never does this',
      'Artificial 24-hour urgency is a classic pressure tactic',
      'Requests sensitive personal information'
    ],
    isPhishing: true
  },
  {
    id: 2,
    sender: 'noreply@github.com',
    displayName: 'GitHub',
    subject: 'New SSH key added to your account',
    time: '10:32',
    type: 'safe',
    unread: true,
    body: `
      <p>Hi there,</p><br>
      <p>A new <strong>SSH key</strong> was added to your GitHub account.</p><br>
      <p><strong>Key fingerprint:</strong> SHA256:Xf7k9mP2...<br>
      <strong>Added:</strong> Today at 10:31 AM UTC<br>
      <strong>IP address:</strong> 192.168.1.1</p><br>
      <p>If you added this key, no action is required.</p><br>
      <p>If you did NOT add this key, please <span class="email-link" style="color:var(--accent3);cursor:default;">remove it immediately</span> in your account settings at <strong>github.com/settings/keys</strong></p><br>
      <p>— The GitHub Team</p>
    `,
    redFlags: [],
    isPhishing: false
  },
  {
    id: 3,
    sender: 'winner@lottery-global-prize.com',
    displayName: 'International Lottery Board',
    subject: '🎉 CONGRATULATIONS! You won $850,000!',
    time: '11:05',
    type: 'phishing',
    unread: true,
    body: `
      <p>DEAR LUCKY WINNER,</p><br>
      <p>We are PLEASED to inform you that your email address has been selected as the WINNER of our <strong>INTERNATIONAL EMAIL LOTTERY</strong> for the sum of <span style="color:var(--accent2);font-size:1.2rem"><strong>$850,000 USD</strong></span>!</p><br>
      <p>To claim your prize you must reply with the following:</p>
      <p>• Full Name<br>• Home Address<br>• Phone Number<br>• Bank Account Details<br>• Processing fee of $250 (required to release funds)</p><br>
      <p>Contact our claims agent immediately: <span class="email-link">agent.james.kofi@lottery-global-prize.com</span></p><br>
      <p>You have 48 HOURS to respond or prize will be forfeited!</p><br>
      <p>CONGRATULATIONS AGAIN!</p>
    `,
    redFlags: [
      'You cannot win a lottery you never entered',
      'Asking for a processing fee to receive prize money — advance fee fraud',
      'Requests bank account details via email',
      'Domain "lottery-global-prize.com" is not a legitimate organisation',
      'ALL CAPS urgency and excessive punctuation',
      'Vague "international" claims with no verifiable organisation'
    ],
    isPhishing: true
  },
  {
    id: 4,
    sender: 'no-reply@accounts.google.com',
    displayName: 'Google',
    subject: 'Security alert: New sign-in to your account',
    time: '13:48',
    type: 'safe',
    unread: false,
    body: `
      <p>Hi,</p><br>
      <p>Your Google Account was just signed in to from a new device.</p><br>
      <p><strong>Device:</strong> Chrome on Windows<br>
      <strong>Location:</strong> London, UK<br>
      <strong>Time:</strong> Monday, 14 Oct, 1:47 PM</p><br>
      <p>If this was you, you don't need to do anything.</p><br>
      <p>If you don't recognise this sign-in, check your account activity at <strong>myaccount.google.com/security</strong></p><br>
      <p>Google will never ask for your password in an email.</p><br>
      <p>Best,<br>The Google Accounts Team</p>
    `,
    redFlags: [],
    isPhishing: false
  },
  {
    id: 5,
    sender: 'hr-department@companY-payroll.info',
    displayName: 'HR Department',
    subject: 'URGENT: Update your direct deposit information',
    time: '15:22',
    type: 'phishing',
    unread: false,
    body: `
      <p>Dear Employee,</p><br>
      <p>As part of our annual <strong>payroll system upgrade</strong>, all employees are required to update their direct deposit banking information by <strong>end of business today</strong>.</p><br>
      <p>Failure to update your details will result in your next paycheck being delayed or withheld.</p><br>
      <p>Please login to update your banking information using your corporate credentials:</p><br>
      <p><span class="email-link">http://company-payroll-portal.info/employee-login</span></p><br>
      <p>This is MANDATORY. Please action immediately.</p><br>
      <p>Kind regards,<br>Human Resources</p>
    `,
    redFlags: [
      'Email domain is "companY-payroll.info" — capitalised Y and .info are suspicious',
      'Threatening to withhold pay creates panic and urgency',
      'No company name or HR contact details provided',
      'Link goes to "company-payroll-portal.info" — not your actual company domain',
      'Legitimate payroll changes are done through secure internal systems',
      '"End of business today" pressure tactic'
    ],
    isPhishing: true
  }
];

let answers = {};
let currentEmail = null;

function renderEmailList() {
  const list = document.getElementById('email-list');
  list.innerHTML = '';
  emails.forEach(email => {
    const li = document.createElement('li');
    li.className = `email-item ${email.unread ? 'unread' : ''} ${email.type === 'phishing' ? 'suspicious' : ''}`;
    li.innerHTML = `
      <span class="email-sender">${email.displayName}</span>
      <span class="email-preview">${email.subject}</span>
      <span class="email-time">${email.time}</span>
    `;
    li.addEventListener('click', () => openEmail(email.id));
    list.appendChild(li);
  });
}

function openEmail(id) {
  currentEmail = emails.find(e => e.id === id);
  const wrap = document.getElementById('email-viewer-wrap');
  const answered = answers[id];

  wrap.innerHTML = `
    <div class="email-viewer active">
      <div class="email-view-header">
        <div class="email-view-subject">${currentEmail.subject}</div>
        <div class="email-meta">
          FROM: <strong style="color:var(--text)">${currentEmail.displayName}</strong> &lt;${currentEmail.sender}&gt;<br>
          TO: you@example.com &nbsp;|&nbsp; ${currentEmail.time}
        </div>
      </div>
      <div class="email-body">${currentEmail.body}</div>
      <div class="verdict-panel">
        <button class="btn btn-outline" id="btn-safe" ${answered !== undefined ? 'disabled' : ''} onclick="submitVerdict(${id}, false)">✅ LEGITIMATE</button>
        <button class="btn btn-danger" id="btn-phish" ${answered !== undefined ? 'disabled' : ''} onclick="submitVerdict(${id}, true)">🎣 PHISHING</button>
      </div>
      <div class="verdict-result ${answered !== undefined ? 'show' : ''} ${answered !== undefined ? (answered === currentEmail.isPhishing ? 'safe' : 'phishing') : ''}" id="verdict-result">
        ${answered !== undefined ? buildVerdictHTML(currentEmail, answered) : ''}
      </div>
    </div>
  `;
}

function buildVerdictHTML(email, userSaidPhishing) {
  const correct = userSaidPhishing === email.isPhishing;
  if (correct && !email.isPhishing) {
    return `✅ CORRECT! This is a legitimate email.<br>Sender domain matches, no suspicious links, no requests for sensitive data.`;
  } else if (correct && email.isPhishing) {
    return `✅ CORRECT! This IS a phishing email. Red flags:<br>${email.redFlags.map(f => `⚠ ${f}`).join('<br>')}`;
  } else if (!correct && email.isPhishing) {
    return `❌ INCORRECT. This WAS a phishing email. Red flags you missed:<br>${email.redFlags.map(f => `⚠ ${f}`).join('<br>')}`;
  } else {
    return `❌ INCORRECT. This is actually a legitimate email from a verified sender. Look for verified domains and absence of suspicious requests.`;
  }
}

function submitVerdict(id, isPhishing) {
  answers[id] = isPhishing;
  openEmail(id);

  // Check if all answered
  if (Object.keys(answers).length === emails.length) showResults();
}

function showResults() {
  const score = Object.entries(answers).filter(([id, ans]) => {
    const email = emails.find(e => e.id == id);
    return ans === email.isPhishing;
  }).length;

  const board = document.getElementById('score-board');
  board.style.display = 'block';
  const body = document.getElementById('score-body');

  const pct = Math.round((score / emails.length) * 100);
  let grade = pct >= 80 ? '🟢 EXCELLENT' : pct >= 60 ? '🟡 NEEDS IMPROVEMENT' : '🔴 NEEDS TRAINING';

  body.innerHTML = `
<span style="color:var(--text-dim)">$</span> <span style="color:var(--glow)">analyse</span> phishing_results.log<br>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br>
SCORE: <span style="color:var(--glow);font-size:1.3rem">${score}/${emails.length}</span> correct &nbsp;|&nbsp; <span style="color:var(--glow)">${pct}%</span><br>
GRADE: <span style="color:${pct>=80?'var(--glow)':pct>=60?'var(--accent2)':'var(--accent)'}">${grade}</span><br>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br>
${pct < 80 ? '<span style="color:var(--accent2)">Tip: Always hover links, check sender domains, and be sceptical of urgency.</span>' : '<span style="color:var(--glow)">Great instincts! Stay vigilant — attackers constantly evolve their tactics.</span>'}<br>
<span style="color:var(--text-dim)">_</span><span class="cursor"></span>
  `;
  board.scrollIntoView({ behavior: 'smooth' });
}

renderEmailList();
