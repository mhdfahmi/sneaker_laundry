<?php

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

// Services routes
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Orders routes
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{identifier}', [OrderController::class, 'show']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
