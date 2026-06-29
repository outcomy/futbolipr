<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$file = __DIR__ . '/../data/db.json';
if (!file_exists($file)) {
  http_response_code(404);
  echo json_encode(['ok' => false, 'error' => 'db.json no existe']);
  exit;
}
readfile($file);
