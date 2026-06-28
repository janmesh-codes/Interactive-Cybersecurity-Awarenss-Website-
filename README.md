A full-stack **Cybersecurity Awareness Web Application** developed to educate users about common cyber threats through interactive learning modules, secure authentication, password analysis, phishing awareness, Wi-Fi security guidance, and an interactive cybersecurity quiz.

The platform is built using **HTML, CSS, JavaScript, PHP, MySQL, and Apache (XAMPP)**. It demonstrates secure web development practices while promoting cybersecurity awareness through an intuitive and user-friendly interface.

> **Project Type:**  Internship Project / Portfolio Project

---

# 📸 Preview


* 🏠 Home Page
<img width="1241" height="734" alt="Screenshot 2026-06-28 132516" src="https://github.com/user-attachments/assets/1477226c-b1d9-4c48-85f4-7c968c0a7b47" />

* 🔐 Login Page
<img width="1245" height="742" alt="Screenshot 2026-06-28 132812" src="https://github.com/user-attachments/assets/b0c07f02-6ad4-4a49-98d4-8a5bc8c70ff2" />

* 📝 Registration Page
<img width="1246" height="740" alt="Screenshot 2026-06-28 132801" src="https://github.com/user-attachments/assets/a1e5042a-093a-4f9a-8bc0-497b3fb3b9f5" />

* 🔑 Password Strength Checker
<img width="1239" height="737" alt="Screenshot 2026-06-28 132625" src="https://github.com/user-attachments/assets/36ee90c6-48ee-445f-96c0-8036778ae474" />

* 🎣 Phishing Awareness Module
<img width="1238" height="743" alt="Screenshot 2026-06-28 132531" src="https://github.com/user-attachments/assets/7b40659c-1111-492c-84f0-b3e1b13b3234" />

* 📶 Wi-Fi Security Module
<img width="1235" height="735" alt="Screenshot 2026-06-28 132654" src="https://github.com/user-attachments/assets/a84521e3-2bc2-45fc-be38-42f62fe664da" />

* 🧠 Cybersecurity Quiz
<img width="1224" height="734" alt="Screenshot 2026-06-28 132638" src="https://github.com/user-attachments/assets/3bb21484-9934-41db-8851-3d54d949356e" />


---

# ✨ Features

## 🌐 Public Home Page

* Publicly accessible landing page
* Simple and responsive navigation
* Easy access to cybersecurity learning resources

---

## 🔐 User Authentication

* User Registration
* Secure Login
* Logout
* PHP Session Management
* Password Hashing (bcrypt)
* Client-side Validation
* Server-side Validation
* Duplicate Email Detection
* Duplicate Phone Number Detection
* Login Attempt Protection
* Audit Logging

---

## 🔑 Password Security Module

* Password Strength Checker
* Password Security Guidelines
* Strong Password Recommendations
* Tips for Creating Secure Passwords

---

## 🎣 Phishing Awareness Module

* Understanding Phishing Attacks
* Fake Email Examples
* Fake Website Recognition
* Social Engineering Awareness
* Best Practices to Avoid Phishing

---

## 📶 Wi-Fi Security Module

* Public Wi-Fi Risks
* Secure Network Practices
* Safe Internet Browsing
* Encryption Awareness
* VPN Awareness

---

## 🧠 Cybersecurity Quiz

* Interactive Multiple Choice Questions
* Instant Score Calculation
* Performance Feedback
* Improve Cybersecurity Knowledge

---

# 🔒 Security Features

The application follows several secure development practices.

* Password Hashing using `password_hash()` (bcrypt)
* Password Verification using `password_verify()`
* PHP Session Authentication
* SQL Injection Protection using Prepared Statements
* Input Validation & Sanitization
* Client-side Validation
* Server-side Validation
* Duplicate Email Detection
* Duplicate Phone Detection
* Login Attempt Limiting
* Secure Logout
* Audit Logging

---

# 🛠️ Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* PHP 8+

## Database

* MySQL

## Server

* Apache (XAMPP)

---

# 📂 Project Structure

```text
PROJECTCYBER/
│
├── index.php
├── login.php
├── register.php
├── logout.php
│
├── password.php
├── phishing.php
├── wifi.php
├── quiz.php
│
├── assets/
│   ├── css/
│   │      style.css
│   │      style1.css
│   │
│   ├── js/
│   │      auth.js
│   │      password.js
│   │      phishing.js
│   │      wifi.js
│   │      quiz.js
│
├── backend/
│   ├── db.php
│   ├── register.php
│   ├── login.php
│   ├── logout.php
│   ├── audit.php
│   └── schema.sql
│
└── README.md
```

---

# 🔄 Application Workflow

```text
                 ┌─────────────────────────────────────────┐
                 │             HOME PAGE                   │
                 │         (Publicly Accessible)           │
                 └─────────────────────────────────────────┘
                                  │
  ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
  ▼              ▼              ▼              ▼              ▼              ▼
Password      Phishing      Wi-Fi        Cyber Quiz      Register        Login
Checker       Awareness     Security                        │              │
                                                           ▼              ▼
                                                   Create Account   Authenticate User
                                                           │              │
                                                           └──────┬───────┘
                                                                  ▼
                                                        Return to Home Page
                                                       (Same Website Access)
```

---

# 📖 Workflow Description

### Home Page

The Home Page is publicly accessible and serves as the central hub of the application. Users can explore cybersecurity awareness content without creating an account.

---

### Password Checker

Users can evaluate the strength of their passwords and learn how to create secure passwords using recommended security practices.

---

### Phishing Awareness

This module educates users about phishing attacks by explaining how attackers deceive victims through fake emails, websites, and social engineering techniques.

---

### Wi-Fi Security

Users learn about the dangers of unsecured wireless networks and how to safely use public Wi-Fi.

---

### Cybersecurity Quiz

An interactive quiz designed to assess users' cybersecurity knowledge while providing immediate feedback.

---

### User Registration

New users can create an account by entering:

* Full Name
* Email Address
* Phone Number
* Password

Before creating an account, the system validates the submitted information and checks for duplicate accounts.

Passwords are securely hashed using **bcrypt** before being stored in the database.

---

### User Login

Registered users authenticate using their email and password.

Successful authentication creates a secure PHP session and redirects the user back to the Home Page.

---

### Logout

Users can securely log out, terminating their active PHP session.

---

# ✅ Validation Process

## Registration Validation

The application validates:

* Full Name
* Email Address
* Phone Number
* Password

Validation occurs on both:

* Client-side (JavaScript)
* Server-side (PHP)

### Password Requirements

Passwords must contain:

* Minimum 8 characters
* One uppercase letter
* One lowercase letter
* One number
* One special character

Duplicate email addresses and phone numbers are not permitted.

---

# 🔐 Login Process

During login, the application:

* Searches for the registered email
* Verifies the password using `password_verify()`
* Creates a PHP session upon successful authentication
* Limits repeated failed login attempts
* Records authentication events in the audit log

---

# 🗄️ Database

The application uses **MySQL** as its backend database.

## Tables

### `users`

Stores:

* Full Name
* Email Address
* Phone Number
* Password Hash
* Registration Date

---

### `audit_log`

Stores security-related events including:

* Registration Success
* Registration Failure
* Duplicate Account Attempts
* Login Success
* Login Failure
* Login Lockout Events

Passwords are never stored in plain text.

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Cybersecurity-Awareness-Platform.git
```

---

## 2. Move the Project

Copy the project folder into:

```text
C:\xampp\htdocs\PROJECTCYBER
```

---

## 3. Start XAMPP

Launch:

* Apache
* MySQL

---

## 4. Create the Database

Open:

```
http://localhost/phpmyadmin
```

Create a database named:

```
securegate
```

Import:

```
backend/schema.sql
```

---

## 5. Configure Database

Open:

```
backend/db.php
```

Example:

```php
$host = "localhost";
$user = "root";
$password = "";
$database = "securegate";
```

---

## 6. Run the Application

Open:

```
http://localhost/PROJECTCYBER/
```

---

# 💻 System Requirements

* PHP 8+
* MySQL
* Apache Web Server
* XAMPP / WAMP / LAMP
* Modern Web Browser

---

# 📝 Notes

* Passwords are securely hashed using bcrypt.
* Plain-text passwords are never stored.
* Input validation is performed on both the client and server.
* SQL Injection attacks are mitigated using prepared statements.
* PHP Sessions are used for authentication.
* Audit logs record important authentication activities.
* HTTPS is recommended for production deployment.

---

# 🚀 Future Enhancements

* Email Verification
* Password Reset
* Two-Factor Authentication (2FA)
* Admin Dashboard
* User Profile Management
* User Progress Tracking
* Leaderboard
* Dark Mode
* Mobile Responsive Design Improvements
* Accessibility Enhancements
* Additional Cybersecurity Awareness Modules
* Cybersecurity News Feed

---

# 🎯 Learning Objectives

This project helps users:

* Understand password security
* Identify phishing attacks
* Learn secure Wi-Fi practices
* Improve cybersecurity awareness
* Test cybersecurity knowledge through quizzes
* Understand secure authentication mechanisms

---

# 📚 Educational Purpose

This project was developed to:

* Promote cybersecurity awareness
* Demonstrate secure authentication techniques
* Practice full-stack web development
* Learn PHP and MySQL integration
* Build a professional portfolio project

---

# 👨‍💻 Developer

## Janmesh GS

**Computer Science Engineering Student**

### Areas of Interest

* Cybersecurity
* Full Stack Web Development
* Artificial Intelligence
* Aviation Technology

---

# 📄 License

This project is developed for:

* Educational Purposes
* Academic Demonstrations
* Internship Projects
* Portfolio Showcase

Feel free to fork, modify, and improve this project for learning purposes.

---

# ⭐ Support

If you found this project helpful, consider giving the repository a **⭐ Star** on GitHub.

Your support is greatly appreciated!

---

## 🛡️ Stay Aware. Stay Secure.
