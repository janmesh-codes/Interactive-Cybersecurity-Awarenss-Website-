<?php
/**
 * register.php — validates and stores a new user.
 *
 * Expects JSON POST body:
 *   { fullName, email, phone, password, confirmPassword }
 *
 * Responds JSON:
 *   { success: true } on success
 *   { success: false, message, field? } on failure
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

$fullName        = trim((string)($input['fullName'] ?? ''));
$email           = trim((string)($input['email'] ?? ''));
$phone           = preg_replace('/[\s-]/', '', trim((string)($input['phone'] ?? '')));
$password        = (string)($input['password'] ?? '');
$confirmPassword = (string)($input['confirmPassword'] ?? '');

// Connect up front so every failure path below (including bad input)
// can still be written to the audit log.
try {
    $conn = getDbConnection();
} catch (mysqli_sql_exception $e) {
    error_log('[SecureGate register.php DB connect error] ' . $e->getMessage());
    respond(500, ['success' => false, 'message' => 'Something went wrong on our end. Please try again shortly.']);
}

/* ----------------------------------------------------------------
 * 1. Empty field validation
 * ---------------------------------------------------------------- */
$missing = [];
if ($fullName === '') $missing[] = 'fullName';
if ($email === '')    $missing[] = 'email';
if ($phone === '')    $missing[] = 'phone';
if ($password === '') $missing[] = 'password';
if ($confirmPassword === '') $missing[] = 'confirmPassword';

if (!empty($missing)) {
    logAudit($conn, 'REGISTER_FAILED', $email ?: null, 'FAILURE', 'Empty required field(s): ' . implode(', ', $missing));
    respond(422, ['success' => false, 'message' => 'Please fill in all required fields.', 'field' => $missing[0]]);
}

/* ----------------------------------------------------------------
 * 2. Format validation
 * ---------------------------------------------------------------- */
if (!preg_match('/^[A-Za-z][A-Za-z\s.\'-]{1,59}$/', $fullName)) {
    logAudit($conn, 'REGISTER_FAILED', $email, 'FAILURE', 'Invalid full name format.');
    respond(422, ['success' => false, 'message' => 'Full name must be 2–60 letters.', 'field' => 'fullName']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    logAudit($conn, 'REGISTER_FAILED', $email, 'FAILURE', 'Invalid email format.');
    respond(422, ['success' => false, 'message' => 'Enter a valid email address.', 'field' => 'email']);
}

if (!preg_match('/^\+?[0-9]{7,15}$/', $phone)) {
    logAudit($conn, 'REGISTER_FAILED', $email, 'FAILURE', 'Invalid phone format.');
    respond(422, ['success' => false, 'message' => 'Phone number must be 7–15 digits.', 'field' => 'phone']);
}

/* ----------------------------------------------------------------
 * 3. Password strength verification
 *    Requires: 8+ chars, upper+lower case, a digit, a special char
 * ---------------------------------------------------------------- */
$strong = strlen($password) >= 8
    && preg_match('/[a-z]/', $password)
    && preg_match('/[A-Z]/', $password)
    && preg_match('/[0-9]/', $password)
    && preg_match('/[^A-Za-z0-9]/', $password);

if (!$strong) {
    logAudit($conn, 'REGISTER_FAILED', $email, 'FAILURE', 'Weak password rejected.');
    respond(422, [
        'success' => false,
        'message' => 'Password must be 8+ characters with upper/lowercase letters, a number, and a symbol.',
        'field'   => 'password',
    ]);
}

/* ----------------------------------------------------------------
 * 4. Password match
 * ---------------------------------------------------------------- */
if (!hash_equals($password, $confirmPassword)) {
    logAudit($conn, 'REGISTER_FAILED', $email, 'FAILURE', 'Password confirmation mismatch.');
    respond(422, ['success' => false, 'message' => 'Passwords do not match.', 'field' => 'confirmPassword']);
}

/* ----------------------------------------------------------------
 * 5. Duplicate check + insert (DB layer)
 * ---------------------------------------------------------------- */
try {
    $stmt = $conn->prepare('SELECT id FROM users WHERE email = ? OR phone = ? LIMIT 1');
    $stmt->bind_param('ss', $email, $phone);
    $stmt->execute();
    $exists = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($exists) {
        logAudit($conn, 'DUPLICATE_DETECTED', $email, 'FAILURE', 'Duplicate email or phone on registration attempt.');
        respond(409, ['success' => false, 'message' => 'An account with this email or phone number already exists.']);
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    $insert = $conn->prepare(
        'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)'
    );
    $insert->bind_param('ssss', $fullName, $email, $phone, $passwordHash);
    $insert->execute();
    $insert->close();

    logAudit($conn, 'REGISTER_SUCCESS', $email, 'SUCCESS', 'New account created.');
    $conn->close();

    respond(201, ['success' => true, 'message' => 'Account created successfully.']);

} catch (mysqli_sql_exception $e) {
    // 1062 = duplicate key (race condition double-submit safety net)
    if ($e->getCode() === 1062) {
        if (isset($conn)) {
            logAudit($conn, 'DUPLICATE_DETECTED', $email, 'FAILURE', 'Duplicate key at insert time.');
        }
        respond(409, ['success' => false, 'message' => 'An account with this email or phone number already exists.']);
    }

    error_log('[SecureGate register.php DB error] ' . $e->getMessage());
    if (isset($conn)) {
        logAudit($conn, 'REGISTER_FAILED', $email, 'FAILURE', 'Database error during registration.');
    }
    respond(500, ['success' => false, 'message' => 'Something went wrong on our end. Please try again shortly.']);
}
