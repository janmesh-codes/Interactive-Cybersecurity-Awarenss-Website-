/* ============================================================
   SecureGate — client-side logic for register.html / login.html
   Talks to backend/register.php and backend/login.php
   ============================================================ */

const API_BASE = 'backend';

/* ---------------------------------------------------------------
   Awareness tip rotator (left panel)
   --------------------------------------------------------------- */
const TIPS = [
  'A strong password mixes upper and lower case, numbers, and symbols — and is never reused across sites.',
  'Enable multi-factor authentication wherever it is offered. It stops most account takeovers cold.',
  'Never enter your password after clicking a link from an unexpected email — type the address in yourself.',
  'Public Wi-Fi is convenient, not private. Avoid logging into sensitive accounts on open networks.',
  'Update your software promptly. Most breaches exploit vulnerabilities that already had a patch available.'
];

(function initTipRail(){
  const tipText = document.getElementById('tipText');
  const tipDots = document.getElementById('tipDots');
  if(!tipText || !tipDots) return;

  let i = 0;
  tipDots.innerHTML = TIPS.map((_, idx) => `<span class="${idx === 0 ? 'active' : ''}"></span>`).join('');
  const dots = tipDots.querySelectorAll('span');

  setInterval(() => {
    i = (i + 1) % TIPS.length;
    tipText.textContent = TIPS[i];
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }, 5000);
})();

/* ---------------------------------------------------------------
   Show / hide password toggles
   --------------------------------------------------------------- */
document.querySelectorAll('.toggle-visibility').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if(!target) return;
    const isHidden = target.type === 'password';
    target.type = isHidden ? 'text' : 'password';
    btn.textContent = isHidden ? 'HIDE' : 'SHOW';
  });
});

/* ---------------------------------------------------------------
   Validation helpers
   --------------------------------------------------------------- */
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_PHONE = /^\+?[0-9]{7,15}$/;
const RE_NAME  = /^[A-Za-z][A-Za-z\s.'-]{1,59}$/;

function setFieldState(input, msgEl, ok, message){
  if(!input) return;
  input.classList.remove('valid', 'invalid');
  if(message === undefined) { msgEl.textContent = ''; return; }
  input.classList.add(ok ? 'valid' : 'invalid');
  msgEl.textContent = message;
  msgEl.className = 'field-msg ' + (ok ? 'ok' : 'error');
}

function showBanner(el, type, message){
  el.className = 'banner show ' + type;
  el.textContent = message;
}

function hideBanner(el){
  el.className = 'banner';
  el.textContent = '';
}

/* ---------------------------------------------------------------
   Password strength → "security clearance" meter + hash preview
   --------------------------------------------------------------- */
function scorePassword(pw){
  let score = 0;
  if(pw.length >= 8) score++;
  if(/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if(/[0-9]/.test(pw)) score++;
  if(/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–4
}

const CLEARANCE_LABELS = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'MAXIMUM'];

// Cosmetic, non-cryptographic scramble just to visualize "this becomes
// unreadable before it is stored". Real hashing happens server-side
// with bcrypt via PHP's password_hash().
function cosmeticHashPreview(pw){
  if(!pw) return 'waiting for input…';
  let out = '';
  for(let i = 0; i < pw.length; i++){
    const code = pw.charCodeAt(i) ^ (i + 7);
    out += code.toString(16).padStart(2, '0');
  }
  return '$2y$10$' + out.slice(0, 22) + (pw.length > 10 ? '…' : '');
}

function updateClearance(pw){
  const bars = [document.getElementById('bar1'), document.getElementById('bar2'), document.getElementById('bar3'), document.getElementById('bar4')];
  const levelEl = document.getElementById('clearanceLevel');
  const hashEl = document.getElementById('hashPreview');
  if(!bars[0]) return 0;

  const score = scorePassword(pw);
  const colors = ['var(--border-line)', 'var(--accent-danger)', 'var(--accent-amber)', 'var(--accent-cyan)', 'var(--accent-success)'];

  bars.forEach((bar, idx) => {
    bar.style.background = idx < score ? colors[score] : 'var(--border-line)';
  });

  levelEl.textContent = CLEARANCE_LABELS[score];
  levelEl.style.color = score === 0 ? 'var(--text-tertiary)' : colors[score];
  hashEl.textContent = cosmeticHashPreview(pw);

  return score;
}

/* =================================================================
   REGISTER PAGE
   ================================================================= */
const registerForm = document.getElementById('registerForm');
if(registerForm){
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const terms = document.getElementById('terms');
  const banner = document.getElementById('formBanner');
  const submitBtn = document.getElementById('submitBtn');

  function validateFullName(){
    const v = fullName.value.trim();
    if(v === ''){ setFieldState(fullName, document.getElementById('fullNameMsg'), false, 'Full name is required.'); return false; }
    if(!RE_NAME.test(v)){ setFieldState(fullName, document.getElementById('fullNameMsg'), false, 'Use letters only, 2–60 characters.'); return false; }
    setFieldState(fullName, document.getElementById('fullNameMsg'), true, 'Looks good.');
    return true;
  }

  function validateEmail(){
    const v = email.value.trim();
    if(v === ''){ setFieldState(email, document.getElementById('emailMsg'), false, 'Email address is required.'); return false; }
    if(!RE_EMAIL.test(v)){ setFieldState(email, document.getElementById('emailMsg'), false, 'Enter a valid email address.'); return false; }
    setFieldState(email, document.getElementById('emailMsg'), true, 'Looks good.');
    return true;
  }

  function validatePhone(){
    const v = phone.value.trim().replace(/[\s-]/g, '');
    if(v === ''){ setFieldState(phone, document.getElementById('phoneMsg'), false, 'Phone number is required.'); return false; }
    if(!RE_PHONE.test(v)){ setFieldState(phone, document.getElementById('phoneMsg'), false, '7–15 digits, optional leading +.'); return false; }
    setFieldState(phone, document.getElementById('phoneMsg'), true, 'Looks good.');
    return true;
  }

  function validatePassword(){
    const v = password.value;
    const score = updateClearance(v);
    if(v === ''){ password.classList.remove('valid','invalid'); return false; }
    if(score < 3){ password.classList.add('invalid'); password.classList.remove('valid'); return false; }
    password.classList.add('valid'); password.classList.remove('invalid');
    return true;
  }

  function validateConfirm(){
    const msgEl = document.getElementById('confirmPasswordMsg');
    if(confirmPassword.value === ''){ setFieldState(confirmPassword, msgEl, false, 'Please confirm your password.'); return false; }
    if(confirmPassword.value !== password.value){ setFieldState(confirmPassword, msgEl, false, 'Passwords do not match.'); return false; }
    setFieldState(confirmPassword, msgEl, true, 'Passwords match.');
    return true;
  }

  fullName.addEventListener('blur', validateFullName);
  email.addEventListener('blur', validateEmail);
  phone.addEventListener('blur', validatePhone);
  password.addEventListener('input', () => { validatePassword(); if(confirmPassword.value) validateConfirm(); });
  confirmPassword.addEventListener('input', validateConfirm);

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideBanner(banner);

    const validName = validateFullName();
    const validEmail = validateEmail();
    const validPhone = validatePhone();
    const validPw = validatePassword();
    const validConfirm = validateConfirm();

    if(!terms.checked){
      showBanner(banner, 'error', 'Please confirm the checkbox to continue.');
      return;
    }

    if(!(validName && validEmail && validPhone && validPw && validConfirm)){
      showBanner(banner, 'error', 'Please fix the highlighted fields before continuing.');
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try{
      const res = await fetch(`${API_BASE}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          password: password.value,
          confirmPassword: confirmPassword.value
        })
      });

      const data = await res.json();

      if(res.ok && data.success){
        showBanner(banner, 'success', 'Account created. Redirecting to sign in…');
        registerForm.reset();
        updateClearance('');
        setTimeout(() => { window.location.href = 'login.html'; }, 1400);
      } else {
        showBanner(banner, 'error', data.message || 'Registration failed. Please try again.');
        if(data.field){
          const fieldMsgEl = document.getElementById(data.field + 'Msg');
          const fieldInput = document.getElementById(data.field);
          if(fieldMsgEl && fieldInput) setFieldState(fieldInput, fieldMsgEl, false, data.message);
        }
      }
    } catch(err){
      showBanner(banner, 'error', 'Could not reach the server. Check your connection and try again.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* =================================================================
   LOGIN PAGE
   ================================================================= */
const loginForm = document.getElementById('loginForm');
if(loginForm){
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const banner = document.getElementById('formBanner');
  const submitBtn = document.getElementById('submitBtn');
  const overlay = document.getElementById('scanOverlay');
  const scanLines = overlay ? overlay.querySelectorAll('.line') : [];

  function validateEmail(){
    const v = email.value.trim();
    const msgEl = document.getElementById('emailMsg');
    if(v === ''){ setFieldState(email, msgEl, false, 'Email address is required.'); return false; }
    if(!RE_EMAIL.test(v)){ setFieldState(email, msgEl, false, 'Enter a valid email address.'); return false; }
    setFieldState(email, msgEl, true, undefined);
    return true;
  }

  function validatePassword(){
    const msgEl = document.getElementById('passwordMsg');
    if(password.value === ''){ setFieldState(password, msgEl, false, 'Password is required.'); return false; }
    setFieldState(password, msgEl, true, undefined);
    return true;
  }

  email.addEventListener('blur', validateEmail);
  password.addEventListener('blur', validatePassword);

  function runScanAnimation(success){
    return new Promise(resolve => {
      if(!overlay){ resolve(); return; }
      overlay.classList.add('show');
      scanLines.forEach(l => l.classList.remove('show', 'done'));

      const stepDelay = 420;
      scanLines.forEach((line, idx) => {
        setTimeout(() => {
          line.classList.add('show');
          const isLast = idx === scanLines.length - 1;
          if(isLast){
            line.querySelector('.mark').textContent = success ? '✓' : '✕';
            line.textContent = '';
            const mark = document.createElement('span');
            mark.className = 'mark';
            mark.textContent = success ? '✓' : '✕';
            line.appendChild(mark);
            line.appendChild(document.createTextNode(success ? ' Access granted.' : ' Access denied.'));
            line.classList.toggle('done', success);
            line.style.color = success ? 'var(--accent-success)' : 'var(--accent-danger)';
          } else {
            line.classList.add('done');
          }
        }, idx * stepDelay);
      });

      setTimeout(resolve, scanLines.length * stepDelay + 500);
    });
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideBanner(banner);

    const validEmail = validateEmail();
    const validPw = validatePassword();
    if(!(validEmail && validPw)) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    let result;
    try{
      const res = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim(), password: password.value })
      });
      result = await res.json();
      result.httpOk = res.ok;
    } catch(err){
      result = { success: false, httpOk: false, message: 'Could not reach the server. Check your connection and try again.' };
    }

    await runScanAnimation(result.success === true);

    if(result.success){
      window.location.href = 'index.html';
    } else {
      if(overlay) overlay.classList.remove('show');
      showBanner(banner, 'error', result.message || 'Invalid email or password.');
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}
