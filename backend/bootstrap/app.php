<?php

$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

/*
|--------------------------------------------------------------------------
| Create Configuration Repository
|--------------------------------------------------------------------------
*/

$config = new Illuminate\Config\Repository();
foreach (glob($app->configPath() . '/*.php') as $file) {
    $name = basename($file, '.php');
    $config->set($name, require $file);
}
$app->instance('config', $config);

/*
|--------------------------------------------------------------------------
| Bind Important Interfaces
|--------------------------------------------------------------------------
*/

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

/*
|--------------------------------------------------------------------------
| Register Service Providers
|--------------------------------------------------------------------------
*/

$app->register(Illuminate\Foundation\Providers\FoundationServiceProvider::class);
$app->register(Illuminate\Encryption\EncryptionServiceProvider::class);
$app->register(Illuminate\Filesystem\FilesystemServiceProvider::class);
$app->register(Illuminate\View\ViewServiceProvider::class);
$app->register(Illuminate\Auth\AuthServiceProvider::class);
$app->register(Illuminate\Bus\BusServiceProvider::class);
$app->register(Illuminate\Cache\CacheServiceProvider::class);
$app->register(Illuminate\Foundation\Providers\ConsoleSupportServiceProvider::class);
$app->register(Illuminate\Database\DatabaseServiceProvider::class);
$app->register(Illuminate\Session\SessionServiceProvider::class);
$app->register(Illuminate\Validation\ValidationServiceProvider::class);
$app->register(Illuminate\Pipeline\PipelineServiceProvider::class);
$app->register(Illuminate\Pagination\PaginationServiceProvider::class);
$app->register(Illuminate\Queue\QueueServiceProvider::class);
$app->register(Illuminate\Routing\RoutingServiceProvider::class);
$app->register(Illuminate\Translation\TranslationServiceProvider::class);

return $app;
