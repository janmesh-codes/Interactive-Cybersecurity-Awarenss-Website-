<?php
/**
 * login.php — authenticates a user against the hashed password
 * on file and starts a PHP session on success.
 *
 * Expects JSON POST body: { email, password }
 * Responds JSON: { success: true, email } or { success: false, message }
 */

declare(strict_types=1);

header('Content-Type: application/json');
require __DIR__ . '/db.php';
require __DIR__ . '/audit.php';

function respond(int $httpCode, array $payload): never
{
    http_response_code($httpCode);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Method not allowed.']);
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!is_array($input)) {
    respond(400, ['success' => false, 'message' => 'Malformed request.']);
}

$email    = trim((string)($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');

try {
    $conn = getDbConnection();
} catch (mysqli_sql_exception $e) {
    error_log('[SecureGate login.php DB connect error] ' . $e->getMessage());
    respond(500, ['success' => false, 'message' => 'Something went wrong on our end. Please try again shortly.']);
}

/* ----------------------------------------------------------------
 * Empty field / format validation
 * ---------------------------------------------------------------- */
if ($email === '' || $password === '') {
    logAudit($conn, 'LOGIN_FAILED', $email ?: null, 'FAILURE', 'Empty email or password.');
    respond(422, ['success' => false, 'message' => 'Enter your email and password.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    logAudit($conn, 'LOGIN_FAILED', $email, 'FAILURE', 'Invalid email format.');
    respond(422, ['success' => false, 'message' => 'Invalid email or password.']);
}

/* ----------------------------------------------------------------
 * Basic brute-force throttle: block after 5 failed attempts for
 * this email within the last 15 minutes.
 * ---------------------------------------------------------------- */
try {
    $check = $conn->prepare(
        "SELECT COUNT(*) AS attempts FROM audit_log
         WHERE email = ? AND event_type = 'LOGIN_FAILED' AND created_at > (NOW() - INTERVAL 15 MINUTE)"
    );
    $check->bind_param('s', $email);
    $check->execute();
    $attempts = (int)($check->get_result()->fetch_assoc()['attempts'] ?? 0);
    $check->close();

    if ($attempts >= 5) {
        logAudit($conn, 'LOGIN_BLOCKED', $email, 'FAILURE', 'Too many failed attempts; temporarily locked.');
        respond(429, ['success' => false, 'message' => 'Too many failed attempts. Please try again in 15 minutes.']);
    }

    /* ----------------------------------------------------------------
     * Look up user and verify the hashed password
     * ---------------------------------------------------------------- */
    $stmt = $conn->prepare('SELECT id, full_name, email, password_hash FROM users WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        logAudit($conn, 'LOGIN_FAILED', $email, 'FAILURE', 'Invalid credentials.');
        respond(401, ['success' => false, 'message' => 'Invalid email or password.']);
    }

    // Success — start the session.
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    session_regenerate_id(true);
    $_SESSION['user_id']    = $user['id'];
    $_SESSION['email']      = $user['email'];
    $_SESSION['full_name']  = $user['full_name'];

    logAudit($conn, 'LOGIN_SUCCESS', $email, 'SUCCESS', 'User authenticated.');
    $conn->close();

    respond(200, ['success' => true, 'email' => $user['email'], 'fullName' => $user['full_name']]);

} catch (mysqli_sql_exception $e) {
    error_log('[SecureGate login.php DB error] ' . $e->getMessage());
    logAudit($conn, 'LOGIN_FAILED', $email, 'FAILURE', 'Database error during login.');
    respond(500, ['success' => false, 'message' => 'Something went wrong on our end. Please try again shortly.']);
}
