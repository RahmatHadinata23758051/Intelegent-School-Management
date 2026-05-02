<?php

return [
    'default' => env('CACHE_DRIVER', 'file'),
    'stores' => [
        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
        ],
        'array' => [
            'driver' => 'array',
        ],
        'null' => [
            'driver' => 'null',
        ],
    ],
    'prefix' => env('CACHE_PREFIX', 'laravel_cache_'),
];
