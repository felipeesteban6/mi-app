<?php

use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:admin|admin_syr'])
    ->get('/syr', fn () => Inertia::render('Demos/SyR'))->name('syr');

Route::middleware(['auth', 'verified', 'role:admin|admin_receta'])
    ->get('/recetas', fn () => Inertia::render('Demos/Recetas'))->name('recetas');

Route::middleware(['auth', 'verified', 'role:admin|admin_juegos'])
    ->get('/juego', fn () => Inertia::render('Demos/Juego'))->name('juego');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [UserRoleController::class, 'index'])->name('users.index');
    Route::post('/users', [UserRoleController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}/roles', [UserRoleController::class, 'update'])->name('users.roles.update');
    Route::delete('/users/{user}', [UserRoleController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/auth.php';
