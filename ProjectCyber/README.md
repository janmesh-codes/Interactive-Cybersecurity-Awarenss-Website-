# SecureGate — Register & Login for the Cybersecurity Awareness Site

A themed registration + login flow with a PHP/MySQL backend.

## What's inside

```
cybersec-auth/
├── register.html         Registration page (frontend)
├── login.html             Login page (frontend)
├── index.php              Placeholder landing page after sign-in
├── assets/
│   ├── css/style.css       Shared design system
│   └── js/auth.js          Client-side validation + API calls
└── backend/
    ├── schema.sql          MySQL tables: users, audit_log
    ├── db.php              DB connection config (edit this)
    ├── audit.php           Shared audit-logging helper
    ├── register.php        Registration endpoint
    ├── login.php            Login endpoint
    └── logout.php           Destroys the session
```

## How it works

- **Registration** validates full name, email, phone, and password on both
  the client (instant feedback) and the server (the source of truth).
  Password rules: 8+ characters, upper + lower case, a number, a symbol.
  Before inserting, it checks for an existing email or phone number and
  rejects duplicates. Passwords are hashed with PHP's `password_hash()`
  (bcrypt) — plain text is never stored.
- **Login** looks up the user by email and verifies the password with
  `password_verify()`. After 5 failed attempts for the same email within
  15 minutes, further attempts are blocked for that window.
- **Audit logging**: every registration success/failure, duplicate
  detection, and login success/failure/lockout is written to the
  `audit_log` table with the event type, email, IP, user agent, and a
  message — useful for reviewing suspicious activity later.

## Setup

1. **Create the database.**
   ```bash
   mysql -u root -p < backend/schema.sql
   ```
   This creates the `securegate` database, a dedicated `securegate_app`
   MySQL user, and the `users` / `audit_log` tables.

2. **Set real credentials.** Edit `backend/db.php` and `backend/schema.sql`
   so the `DB_PASS` constant matches the password you gave the
   `securegate_app` user (the default `CHANGE_ME` is a placeholder —
   change it in both places before going live).

3. **Run it locally** with PHP's built-in server from the project root:
   ```bash
   php -S localhost:8000
   ```
   Then open `http://localhost:8000/register.html`.

   Or drop the whole folder into XAMPP/WAMP's `htdocs`, or any host that
   supports PHP 8+ with the `mysqli` extension enabled.

4. **Test the flow:** register an account, then sign in with the same
   email and password from `login.html`. A successful login redirects to
   `dashboard.html` and starts a PHP session.

## Notes for production use

- Serve everything over HTTPS — login and register both transmit
  passwords.
- The "live hash preview" shown while typing a password on the register
  page is a cosmetic visual only (not real bcrypt output); the actual
  hashing happens server-side in `register.php`.
- Consider adding CSRF tokens and a proper rate limiter (e.g. Redis-backed)
  if this goes beyond a coursework/demo deployment.
- `index.php` is a placeholder — swap it for your real awareness
  platform landing page, and gate it server-side by checking
  `$_SESSION['user_id']` rather than relying on the query string.
