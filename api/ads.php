<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$adsDirectory = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'ads';
$extensions = ['png', 'jpg', 'jpeg', 'webp'];
$ads = [];

if (is_dir($adsDirectory)) {
    foreach (scandir($adsDirectory) ?: [] as $filename) {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!in_array($extension, $extensions, true)) {
            continue;
        }

        $ads[] = './assets/ads/' . rawurlencode($filename);
    }
}

sort($ads, SORT_NATURAL | SORT_FLAG_CASE);
echo json_encode($ads, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
