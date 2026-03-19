<?php
// contact.php — Envío de correo desde el formulario de contacto

require_once 'config.php';
require_once 'lib/PHPMailer.php';
require_once 'lib/SMTP.php';
require_once 'lib/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido.']);
    exit;
}

// 1. Leer y sanitizar los datos del formulario
$input   = json_decode(file_get_contents('php://input'), true);
$name    = trim(strip_tags($input['name']    ?? ''));
$email   = trim($input['email']              ?? '');
$message = trim(strip_tags($input['message'] ?? ''));

// 2. Validación en servidor
if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Todos los campos son obligatorios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'El email no es válido.']);
    exit;
}

// 3. Enviar correo con PHPMailer via Gmail SMTP
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = MAIL_FROM;
    $mail->Password   = MAIL_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(MAIL_FROM, 'Duality ROSE Web');
    $mail->addAddress(MAIL_TO, 'Duality ROSE');
    $mail->addReplyTo($email, $name); // Responder directamente al remitente

    $mail->Subject = "Nuevo mensaje de contacto: {$name}";
    $mail->isHTML(false);
    $mail->Body =
        "Has recibido un nuevo mensaje desde el formulario de contacto de dualityrose.com.\n\n" .
        "Nombre:  {$name}\n" .
        "Email:   {$email}\n\n" .
        "Mensaje:\n{$message}";

    $mail->send();
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el mensaje. Inténtalo más tarde.']);
}
