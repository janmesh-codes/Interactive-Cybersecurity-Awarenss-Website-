<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.html');
    exit;
}

$userName  = htmlspecialchars($_SESSION['full_name'] ?? '');
$userEmail = htmlspecialchars($_SESSION['email'] ?? '');
$userId    = htmlspecialchars((string)($_SESSION['user_id'] ?? ''));
$sessionId = htmlspecialchars(session_id());
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard · SecureGate</title>
<link rel="stylesheet" href="assets/css/style.css">
<style>
  .dash-wrap{
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .dash-card{
    width: 100%;
    max-width: 440px;
    background: var(--bg-card);
    border: 1px solid var(--border-line);
    border-radius: var(--radius-lg);
    padding: 36px;
    text-align: center;
  }
  .dash-badge{
    width: 52px; height: 52px;
    margin: 0 auto 18px;
    border-radius: 50%;
    border: 1.5px solid var(--accent-success);
    color: var(--accent-success);
    display: grid; place-items: center;
    font-family: var(--font-mono);
    font-size: 20px;
  }
  .dash-card h1{ font-family: var(--font-display); font-size: 22px; margin-bottom: 8px; }
  .dash-card p{ color: var(--text-secondary); font-size: 14px; margin-bottom: 24px; }
  .dash-user{
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-tertiary);
    background: var(--bg-input);
    border: 1px solid var(--border-line);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    margin-bottom: 24px;
    text-align: left;
  }
  .dash-user span{ color: var(--text-primary); }
</style>
</head>
<body>
  <div class="dash-wrap">
    <div class="dash-card">
      <div class="dash-badge">&#10003;</div>
      <h1>Access granted</h1>
      <p>You're signed in to SecureGate. This is your secure dashboard. Use the links below to continue your awareness training.</p>
      <div class="dash-user">
        <div><strong>Name:</strong> <?php echo $userName ?: 'Unknown user'; ?></div>
        <div><strong>Email:</strong> <?php echo $userEmail; ?></div>
        <div><strong>Session ID:</strong> <?php echo $sessionId; ?></div>
      </div>

      <div class="dash-links" style="margin: 24px 0; text-align:left;">
        <h2 style="font-size:1rem; margin-bottom:.75rem; color:var(--text-secondary);">Continue your training</h2>
        <ul style="list-style:none; padding:0; margin:0;">
          <li><a href="phishing.html">Phishing Simulator</a></li>
          <li><a href="password.html">Password Checker</a></li>
          <li><a href="quiz.html">Scam Quiz</a></li>
          <li><a href="wifi.html">Wi-Fi Safety</a></li>
        </ul>
      </div>

      <button class="btn-primary" id="logoutBtn" style="max-width: 220px; margin: 0 auto;">
        <span class="btn-label">Sign out</span>
      </button>
    </div>
  </div>

<script>
  document.getElementById('logoutBtn').addEventListener('click', () => {
    window.location.href = 'backend/logout.php';
  });
</script>
</body>
</html>
