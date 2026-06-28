const questions = [
  {
    q: 'You receive a text from "HMRC" saying you owe tax and will be arrested if you don\'t pay via iTunes gift cards within 2 hours. What should you do?',
    options: ['Buy the gift cards and send the codes immediately', 'Call the number in the text to confirm', 'Ignore it — government agencies never demand gift card payment', 'Reply to the text asking for more information'],
    correct: 2,
    explain: 'Government agencies NEVER demand payment via gift cards, cryptocurrency, or wire transfers with a tight deadline. This is a classic "impersonation + urgency + unusual payment" scam.'
  },
  {
    q: 'A pop-up on your screen says "YOUR COMPUTER IS INFECTED! Call Microsoft Support NOW at 1-800-XXX-XXXX." What is this?',
    options: ['A genuine Microsoft security alert', 'A browser notification from your antivirus', 'A tech support scam — Microsoft never calls you unsolicited', 'A Windows system warning you should act on'],
    correct: 2,
    explain: 'Microsoft and Apple will never display phone numbers in pop-up warnings or call you unsolicited about computer problems. Close the tab, do not call the number. Run a real antivirus scan if concerned.'
  },
  {
    q: 'Which of these passwords is the STRONGEST?',
    options: ['P@ssword1!', 'correct-horse-battery-staple-77', 'qwerty123', 'MyDog$Fido2024'],
    correct: 1,
    explain: 'A long passphrase of random words beats short complex passwords. "correct-horse-battery-staple-77" has far higher entropy due to its length (~50 bits), despite looking simpler than "P@ssword1!".'
  },
  {
    q: 'You get a LinkedIn message from a recruiter offering a $200K remote job requiring you to pay $500 for "training materials" upfront. This is likely:',
    options: ['A legitimate job — companies often charge for materials', 'A job scam — legitimate employers never ask for upfront payment', 'Normal for remote positions', 'Worth investigating further by sending the money'],
    correct: 1,
    explain: 'Legitimate employers never require candidates to pay for training, equipment, or background checks. This is a classic "advance fee" employment scam. The job does not exist.'
  },
  {
    q: 'When using public Wi-Fi at a coffee shop, which activity is MOST risky without a VPN?',
    options: ['Reading a news website', 'Online banking or entering passwords', 'Watching YouTube', 'Searching on Google'],
    correct: 1,
    explain: 'On unencrypted public Wi-Fi, attackers can intercept traffic. Online banking and entering passwords is highest risk. Always use a VPN or wait for a trusted network for sensitive activities.'
  },
  {
    q: 'A friend\'s Facebook account messages you: "I\'m stranded in Spain, my wallet was stolen. Can you send me £200 via Western Union?" What should you do?',
    options: ['Send the money — it\'s your friend in need', 'Send half the amount to be safe', 'Call your friend\'s phone number to verify — their account is likely hacked', 'Reply asking for more details before sending'],
    correct: 2,
    explain: 'This is a "stranded traveller" scam — the account is compromised. Always verify through a separate channel (phone call, text). Never send money to a social media message, even from apparent friends.'
  },
  {
    q: 'What does "https" in a website URL indicate?',
    options: ['The website is completely safe and trustworthy', 'The connection between you and the server is encrypted', 'The site has been verified by the government', 'Your data is automatically backed up'],
    correct: 1,
    explain: 'HTTPS only means the connection is encrypted — it does NOT mean the website is legitimate or safe. Phishing sites also use HTTPS. Always check the full domain name carefully.'
  },
  {
    q: 'You receive an email saying you\'ve been selected for a £5,000 refund from Amazon. They need your bank details to process it. You should:',
    options: ['Provide your details — it\'s free money!', 'Give only your sort code, not account number', 'Delete it — legitimate refunds go back to your original payment method', 'Forward it to friends so they can also claim'],
    correct: 2,
    explain: 'Amazon and all legitimate retailers automatically refund to your original payment method. Asking for bank details to "process a refund" is a trick to steal your money, not give you any.'
  },
  {
    q: 'What is "two-factor authentication" (2FA)?',
    options: ['Using two different passwords for one account', 'A second verification step (e.g. a code) after entering your password', 'Logging in from two different devices simultaneously', 'Having a backup email and phone on your account'],
    correct: 1,
    explain: '2FA adds a second verification layer — typically a one-time code from an app or SMS — so that knowing your password alone is not enough to access your account. Always enable it where available.'
  },
  {
    q: 'Someone calls claiming to be your bank\'s fraud team. They say your account is compromised and ask you to "verify" your full card number, PIN, and CVV. You should:',
    options: ['Provide the details — your bank needs them to protect you', 'Give only the last 4 digits', 'Hang up and call your bank\'s official number from the back of your card', 'Ask them to email you a verification link instead'],
    correct: 2,
    explain: 'Your bank will NEVER ask for your full PIN, CVV, or full card number over the phone. This is "vishing" (voice phishing). Always hang up and call back using the number printed on your physical card.'
  }
];

let current = 0;
let score = 0;
let answered = [];

function renderProgress() {
  return `<div class="quiz-progress">
    ${questions.map((_, i) => `<div class="quiz-pip ${i < current ? 'done' : i === current ? 'current' : ''}"></div>`).join('')}
  </div>`;
}

function renderQuestion(idx) {
  const q = questions[idx];
  const isAnswered = answered[idx] !== undefined;
  return `
    ${renderProgress()}
    <div class="quiz-card">
      <div class="quiz-number">QUESTION ${idx + 1} / ${questions.length}</div>
      <div class="quiz-question">${q.q}</div>
      <ul class="quiz-options">
        ${q.options.map((opt, i) => {
          let cls = '';
          if (isAnswered) {
            if (i === q.correct) cls = 'correct';
            else if (i === answered[idx] && i !== q.correct) cls = 'wrong';
          }
          return `<li>
            <button class="quiz-option ${cls}" ${isAnswered ? 'disabled' : ''} onclick="answer(${idx}, ${i})">
              <span style="font-family:var(--font-mono);color:var(--text-dim);min-width:20px">${String.fromCharCode(65+i)}.</span>
              ${opt}
            </button>
          </li>`;
        }).join('')}
      </ul>
      <div class="quiz-explain ${isAnswered ? 'show' : ''}" id="explain">
        ${isAnswered ? `💡 ${q.explain}` : ''}
      </div>
      ${isAnswered ? `<div class="quiz-nav">
        ${idx < questions.length - 1
          ? `<button class="btn btn-outline" onclick="next()">NEXT →</button>`
          : `<button class="btn btn-primary" onclick="showScore()">SEE RESULTS →</button>`
        }
      </div>` : ''}
    </div>
  `;
}

function renderScore() {
  const pct = Math.round((score / questions.length) * 100);
  let msg, sub;
  if (pct === 100) { msg = '🏆 PERFECT SCORE!'; sub = 'Outstanding! You are a cyber security expert. Keep staying vigilant.'; }
  else if (pct >= 80) { msg = '✅ EXCELLENT AWARENESS'; sub = 'Great instincts! Review the questions you missed and stay sharp.'; }
  else if (pct >= 60) { msg = '⚠ DECENT — KEEP LEARNING'; sub = 'You have a good foundation, but there are gaps. Scammers evolve constantly.'; }
  else { msg = '❌ HIGH RISK PROFILE'; sub = 'You may be vulnerable to common scams. Review all modules carefully.'; }

  const color = pct >= 80 ? 'var(--glow)' : pct >= 60 ? 'var(--accent2)' : 'var(--accent)';

  return `
    <div class="quiz-card quiz-score">
      <div class="score-ring" style="border-color:${color}22">
        <div class="score-num" style="color:${color};text-shadow:0 0 20px ${color}">${score}/${questions.length}</div>
        <div class="score-label">${pct}%</div>
      </div>
      <div class="score-msg">${msg}</div>
      <div class="score-sub">${sub}</div>
      <div class="flex-row" style="justify-content:center">
        <button class="btn btn-outline" onclick="restart()">↺ RETRY QUIZ</button>
        <a href="index.html" class="btn btn-primary">← BACK TO HOME</a>
      </div>
    </div>
  `;
}

function render() {
  const container = document.getElementById('quiz-container');
  if (current >= questions.length) {
    container.innerHTML = renderScore();
  } else {
    container.innerHTML = renderQuestion(current);
  }
}

function answer(idx, choice) {
  answered[idx] = choice;
  if (choice === questions[idx].correct) score++;
  render();
}

function next() {
  current++;
  render();
}

function showScore() {
  current = questions.length;
  render();
}

function restart() {
  current = 0;
  score = 0;
  answered = [];
  render();
}

render();
