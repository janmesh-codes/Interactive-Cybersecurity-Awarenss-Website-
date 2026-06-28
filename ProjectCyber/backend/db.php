<?php
/**
 * db.php — MySQL connection for the SecureGate auth backend.
 *
 * Edit the four constants below to match your environment, or set
 * them as real environment variables on your server instead of
 * hardcoding values here.
 */

declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_NAME = 'securegate';
const DB_USER = 'securegate_app';   // do NOT use root in production
const DB_PASS = 'CHANGE_ME';
const DB_PORT = 3306;

// Make mysqli throw exceptions instead of warnings so every script
// can handle DB errors with a single try/catch.
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

/**
 * Returns a mysqli connection. Throws mysqli_sql_exception on failure,
 * which calling scripts should catch and translate into a safe,
 * generic JSON error response (never leak raw DB errors to the client).
 */
function getDbConnection(): mysqli
{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    $conn->set_charset('utf8mb4');
    return $conn;
}
