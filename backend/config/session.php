<?php

return [
    'driver' => env('SESSION_DRIVER', 'file'),
    'lifetime' => env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => null,
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],
    'cookie' => env(
        'SESSION_COOKIE',
        'ISMS_EWA_SESSION'
    ),
    'path' => env('SESSION_PATH', '/'),
    'domain' => env('SESSION_DOMAIN'),
    'secure' => env('SESSION_SECURE_COOKIES', false),
    'http_only' => true,
    'same_site' => env('SESSION_SAME_SITE', 'lax'),
];
