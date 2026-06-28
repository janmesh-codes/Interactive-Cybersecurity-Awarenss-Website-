const commonWords = ['password','123456','qwerty','letmein','dragon','master','admin','login','pass','test','user','abc123','monkey','shadow','sunshine','princess','football','welcome','hello','iloveyou'];
const sequences = ['qwerty','asdfgh','zxcvbn','qwertz','abcdef','123456','654321','098765'];

const input = document.getElementById('pw-input');
const bar = document.getElementById('strength-bar');
const label = document.getElementById('strength-label');
const crackVal = document.getElementById('crack-val');
const entropyScore = document.getElementById('entropy-score');
const entropyBar = document.getElementById('entropy-bar');
const entropyPanel = document.getElementById('entropy-panel');

const toggle = document.getElementById('pw-toggle');
toggle.addEventListener('click', () => {
  input.type = input.type === 'password' ? 'text' : 'password';
  toggle.textContent = input.type === 'password' ? '👁' : '🙈';
});

document.getElementById('gen-btn').addEventListener('click', generatePassword);

function generatePassword() {
  const words = ['azure','crimson','falcon','vertex','lunar','prism','echo','nexus','storm','cipher','raven','forge','orbit','ghost','titan'];
  const w1 = words[Math.floor(Math.random()*words.length)];
  const w2 = words[Math.floor(Math.random()*words.length)];
  const num = Math.floor(Math.random()*900)+100;
  const syms = ['!','@','#','$','%','&','*'];
  const sym = syms[Math.floor(Math.random()*syms.length)];
  const pw = `${w1.charAt(0).toUpperCase()}${w1.slice(1)}-${w2}-${num}${sym}`;
  document.getElementById('suggested-pw').textContent = pw;
}

generatePassword();

function calcEntropy(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  return pw.length * Math.log2(pool || 1);
}

function crackTime(entropy) {
  const guesses = Math.pow(2, entropy);
  const perSec = 1e10; // 10 billion guesses/sec (modern GPU)
  const secs = guesses / perSec;
  if (secs < 1) return 'Instantly';
  if (secs < 60) return `${Math.round(secs)} seconds`;
  if (secs < 3600) return `${Math.round(secs/60)} minutes`;
  if (secs < 86400) return `${Math.round(secs/3600)} hours`;
  if (secs < 2592000) return `${Math.round(secs/86400)} days`;
  if (secs < 31536000) return `${Math.round(secs/2592000)} months`;
  if (secs < 3153600000) return `${Math.round(secs/31536000)} years`;
  if (secs < 3.15e13) return `${Math.round(secs/3153600000).toLocaleString()} centuries`;
  return 'Heat death of the universe';
}

function check(pw) {
  const checks = {
    len:    pw.length >= 12,
    upper:  /[A-Z]/.test(pw),
    lower:  /[a-z]/.test(pw),
    num:    /[0-9]/.test(pw),
    sym:    /[^a-zA-Z0-9]/.test(pw),
    nodict: !commonWords.some(w => pw.toLowerCase().includes(w)),
    norep:  !/(.)\1{2,}/.test(pw),
    seq:    !sequences.some(s => pw.toLowerCase().includes(s))
  };

  const ids = { len:'c-len',upper:'c-upper',lower:'c-lower',num:'c-num',sym:'c-sym',nodict:'c-nodict',norep:'c-norep',seq:'c-seq' };
  const labels = { len:'At least 12 characters',upper:'Uppercase letter',lower:'Lowercase letter',num:'Number',sym:'Special character',nodict:'Not a common word',norep:'No repeating patterns',seq:'No keyboard sequences' };

  let score = 0;
  for (const [key, pass] of Object.entries(checks)) {
    const el = document.getElementById(ids[key]);
    el.className = pass ? 'pass' : 'fail';
    el.textContent = (pass ? '✓' : '✗') + '  ' + labels[key];
    if (pass) score++;
  }

  return { checks, score };
}

function getStrengthColor(score) {
  if (score <= 2) return '#ff3c3c';
  if (score <= 4) return '#ff7a00';
  if (score <= 5) return '#ffb800';
  if (score <= 6) return '#a0d000';
  return '#00ff41';
}

function getStrengthText(score) {
  if (score <= 2) return '⛔ VERY WEAK';
  if (score <= 4) return '⚠ WEAK';
  if (score <= 5) return '◈ MODERATE';
  if (score <= 6) return '◉ STRONG';
  return '✔ VERY STRONG';
}

input.addEventListener('input', () => {
  const pw = input.value;

  if (!pw) {
    bar.style.width = '0%';
    label.textContent = 'Enter a password to analyse';
    crackVal.textContent = '—';
    entropyScore.textContent = '0 bits';
    entropyBar.style.width = '0%';
    entropyPanel.innerHTML = '<span style="color:var(--text-dim)">Waiting for input...</span><span class="cursor"></span>';
    // reset criteria
    ['c-len','c-upper','c-lower','c-num','c-sym','c-nodict','c-norep','c-seq'].forEach(id => {
      const el = document.getElementById(id);
      el.className = 'fail';
    });
    return;
  }

  const { score } = check(pw);
  const entropy = calcEntropy(pw);
  const pct = (score / 8) * 100;
  const color = getStrengthColor(score);

  bar.style.width = pct + '%';
  bar.style.background = color;
  label.textContent = getStrengthText(score);
  label.style.color = color;

  crackVal.textContent = crackTime(entropy);
  crackVal.style.color = score >= 6 ? 'var(--glow)' : score >= 4 ? 'var(--accent2)' : 'var(--accent)';

  const entropyPct = Math.min((entropy / 128) * 100, 100);
  entropyScore.textContent = `${Math.round(entropy)} bits`;
  entropyBar.style.width = entropyPct + '%';
  entropyBar.style.background = color;

  // Entropy analysis panel
  const charTypes = [];
  if (/[a-z]/.test(pw)) charTypes.push('lowercase(26)');
  if (/[A-Z]/.test(pw)) charTypes.push('uppercase(26)');
  if (/[0-9]/.test(pw)) charTypes.push('digits(10)');
  if (/[^a-zA-Z0-9]/.test(pw)) charTypes.push('symbols(32)');
  const poolSize = (/[a-z]/.test(pw)?26:0)+(/[A-Z]/.test(pw)?26:0)+(/[0-9]/.test(pw)?10:0)+(/[^a-zA-Z0-9]/.test(pw)?32:0);

  entropyPanel.innerHTML = `
<span style="color:var(--text-dim)">$</span> <span style="color:var(--glow)">analyse</span> --entropy<br>
Length: <span style="color:var(--glow)">${pw.length}</span> chars<br>
Character pool: <span style="color:var(--accent3)">${poolSize}</span> symbols<br>
Types: <span style="color:var(--accent3)">${charTypes.join(', ') || 'none'}</span><br>
Entropy: <span style="color:${color};text-shadow:0 0 8px ${color}">${Math.round(entropy)} bits</span><br>
Crack estimate: <span style="color:${color}">${crackTime(entropy)}</span><br>
<span style="color:var(--text-dim)">_</span><span class="cursor"></span>
  `;
});
