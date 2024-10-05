<?php

namespace App\Http\Middleware;

use App\Models\Task;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TaskMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        
        if (!is_numeric($request->taskId)) {
            return response()->json(['error' => 'The taskId must be numeric'], 422);
        }
    
        $project = Task::where('id', $request->taskId)->first();
    
        if (!$project) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        return $next($request);
    }
}
