<?php

use App\Http\Controllers\API\ProjectsController;
use App\Http\Controllers\API\TaskController;
use App\Http\Middleware\ProjectMiddleware;
use App\Http\Middleware\TaskMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes Projects
Route::controller(ProjectsController::class)->middleware([ProjectMiddleware::class])->group(function () {
    Route::get('/projects', 'index')->name('projects.index')->withoutMiddleware([ProjectMiddleware::class]);
    Route::post('/projects', 'store')->name('projects.store')->withoutMiddleware([ProjectMiddleware::class]);
    Route::get('/projects/{projectId}', 'show')->name('projects.show');
    Route::put('/projects/{projectId}', 'update')->name('projects.update');
    Route::delete('/projects/{projectId}', 'destroy')->name('projects.destroy');
});

// Routes Tasks
Route::controller(TaskController::class)->middleware([ProjectMiddleware::class, TaskMiddleware::class])->group(function () {
    Route::get('/projects/{projectId}/tasks', 'index')->name('tasks.index')->withoutMiddleware([TaskMiddleware::class]);
    Route::post('/projects/{projectId}/tasks', 'store')->name('tasks.store')->withoutMiddleware([TaskMiddleware::class]);
    Route::get('/projects/{projectId}/tasks/{taskId}', 'show')->name('tasks.show');
    Route::put('/projects/{projectId}/tasks/{taskId}', 'update')->name('tasks.update');
    Route::delete('/projects/{projectId}/tasks/{taskId}', 'destroy')->name('tasks.destroy');
    Route::put('/projects/{projectId}/tasks/{taskId}/status', 'updateStatus')->name('tasks.updateStatus');
});
