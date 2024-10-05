<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Project;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProjectMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!is_numeric($request->projectId)) {
            return response()->json(['error' => 'The projectId must be numeric'], 422);
        }

        $project = Project::where('id', $request->projectId)->first();

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }
        return $next($request);
    }
}
