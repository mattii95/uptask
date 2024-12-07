<?php

namespace App\Http\Controllers\API;

use App\Models\Project;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\ProjectCollection;
use App\Http\Requests\Project\StoreRequest;
use App\Http\Requests\Project\UpdateRequest;

class ProjectsController extends Controller
{
    
    public function index()
    {
        $projects = auth()->user()->projects->merge(auth()->user()->assignedProjects);
        return new ProjectCollection($projects);
    }

    public function store(StoreRequest $request)
    {
        $project = new Project($request->validated());
        $result = auth()->user()->projects()->save($project);
        return response()->json(['data' => $result, 'message' => 'Created project succesful'], 201);
    }

    public function show(string $projectId)
    {
        $project = Project::with('tasks')->find($projectId);

        if(!Gate::allows('show', $project)) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        return response()->json(['data' => $project]);
    }

    public function update(UpdateRequest $request, string $projectId)
    {
        $project = Project::find($projectId);

        if(!Gate::allows('update', $project)) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        $project = Project::where('id', $projectId)->update($request->validated());

        return response()->json(['data' => $project, 'message' => 'Updated project succesful']);
    }

    public function destroy(string $projectId)
    {
        $project = Project::find($projectId);

        if(!Gate::allows('delete', $project)) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        $project = Project::where('id', $projectId)->delete();
        return response()->json(['data' => $project, 'message' => 'Deleted project succesful']);
    }
}
