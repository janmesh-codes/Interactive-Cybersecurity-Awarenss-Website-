<?php
/**
 * audit.php — writes one row per security-relevant event:
 * successful/failed registrations, duplicate detection, and
 * successful/failed/blocked logins.
 */

declare(strict_types=1);

function logAudit(
    mysqli $conn,
    string $eventType,
    ?string $email,
    string $status,
    ?string $message = null
): void {
    try {
        $stmt = $conn->prepare(
            'INSERT INTO audit_log (event_type, email, ip_address, user_agent, status, message)
             VALUES (?, ?, ?, ?, ?, ?)'
        );

        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
        $ua = isset($_SERVER['HTTP_USER_AGENT'])
            ? substr($_SERVER['HTTP_USER_AGENT'], 0, 255)
            : null;

        $stmt->bind_param('ssssss', $eventType, $email, $ip, $ua, $status, $message);
        $stmt->execute();
        $stmt->close();
    } catch (Throwable $e) {
        // Audit logging must never break the primary request flow.
        // If you have an application error log, write to it here.
        error_log('[SecureGate audit logging failed] ' . $e->getMessage());
    }
}
