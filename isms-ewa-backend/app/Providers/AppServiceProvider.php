<?php

namespace App\Providers;

use App\Models\Grade;
use App\Models\Violation;
use App\Observers\GradeObserver;
use App\Observers\ViolationObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Grade::observe(GradeObserver::class);
        Violation::observe(ViolationObserver::class);
    }
}
