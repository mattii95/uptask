<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreRequest;
use App\Http\Requests\Project\UpdateRequest;
use App\Http\Resources\ProjectCollection;
use App\Models\Project;

class ProjectsController extends Controller
{
    
    public function index()
    {
        return new ProjectCollection(Project::all());
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        return response()->json(['data' => Project::create($data), 'message' => 'Created project succesful'], 201);
    }

    public function show(string $projectId)
    {
        $project = Project::find($projectId);
        return response()->json(['project' => $project, 'tasks' => $project->tasks]);
    }

    public function update(UpdateRequest $request, string $projectId)
    {
        $project = Project::where('id', $projectId)->update($request->validated());
        return response()->json(['data' => $project, 'message' => 'Updated project succesful']);
    }

    public function destroy(string $projectId)
    {
        $project = Project::where('id', $projectId)->delete();
        return response()->json(['data' => $project, 'message' => 'Deleted project succesful']);
    }
}
