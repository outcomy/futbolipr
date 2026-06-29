<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
require __DIR__ . '/config.php';
$token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
if (!$token || !hash_equals(ADMIN_SAVE_TOKEN, $token)) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'No autorizado']);
  exit;
}
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data) || empty($data['categories']) || !isset($data['teams']) || !isset($data['players'])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'JSON invalido']);
  exit;
}
$file = __DIR__ . '/../data/db.json';
$tmp = $file . '.tmp';
$encoded = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
if ($encoded === false || file_put_contents($tmp, $encoded, LOCK_EX) === false || !rename($tmp, $file)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'No se pudo guardar']);
  exit;
}
echo json_encode(['ok' => true, 'savedAt' => date('c')]);
