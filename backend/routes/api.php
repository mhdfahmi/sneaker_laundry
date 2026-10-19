<?php

use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminServiceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check / API status
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'Sneaker Laundry API',
        'time' => now()->toIso8601String(),
    ]);
});

// Services routes (publik)
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Orders routes (publik)
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{identifier}', [OrderController::class, 'show']);

// ---------------------------------------------------------------
// Admin
// ---------------------------------------------------------------
Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Pesanan
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);

    // Layanan & harga
    Route::post('/services', [AdminServiceController::class, 'store']);
    Route::put('/services/{id}', [AdminServiceController::class, 'update']);
    Route::delete('/services/{id}', [AdminServiceController::class, 'destroy']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
