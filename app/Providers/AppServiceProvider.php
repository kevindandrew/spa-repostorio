<?php

namespace App\Providers;

use App\Auth\CorreoUserProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
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
        Vite::prefetch(concurrency: 3);

        Auth::provider('correo-eloquent', function ($app, array $config) {
            return new CorreoUserProvider($app['hash'], $config['model']);
        });
    }
}
