<?php
// ai.php — Proxy hacia OpenRouter con base de conocimiento en ../docs/info-rose.md

require_once 'config.php';

header('Content-Type: application/json');

// 1. Leer la pregunta del usuario
$input = json_decode(file_get_contents('php://input'), true);
$question = trim($input['question'] ?? '');

if (!$question) {
    http_response_code(400);
    echo json_encode(['answer' => 'Por favor, escribe una pregunta válida.']);
    exit;
}

// 2. Leer el archivo de conocimiento
$info = file_get_contents('../docs/info-rose.md');
if (!$info) {
    http_response_code(500);
    echo json_encode(['answer' => 'No se pudo cargar la base de conocimiento.']);
    exit;
}

// 3. Preparar el prompt con el contexto incluido
$payload = [
    "model" => "openai/gpt-3.5-turbo",
    "messages" => [
        [
            "role" => "system",
            "content" => "Eres un asistente IA del estudio Duality ROSE. Solo puedes responder basándote en la siguiente información del estudio:\n\n" . $info
        ],
        [
            "role" => "user",
            "content" => $question
        ]
    ]
];

// 4. Enviar petición a OpenRouter
$ch = curl_init('https://openrouter.ai/api/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . OPENROUTER_API_KEY,
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response   = curl_exec($ch);
$http_code  = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    $error = curl_error($ch);
    curl_close($ch);
    http_response_code(502);
    echo json_encode(['answer' => 'Error de conexión con el servicio de IA.']);
    exit;
}

curl_close($ch);

// 5. Procesar respuesta
$data       = json_decode($response, true);
$error_code = $data['error']['code'] ?? null;

// 6. Límite de crédito semanal alcanzado
if ($http_code === 403 || $error_code === 403) {
    echo json_encode([
        'answer' => 'Rose ha alcanzado su límite de conversación esta semana.',
        'link'   => [
            'url'  => 'history-line.html',
            'text' => 'Descubre más sobre Duality ROSE'
        ]
    ]);
    exit;
}

$reply = $data['choices'][0]['message']['content'] ?? 'No se pudo obtener respuesta.';

echo json_encode(['answer' => $reply]);
