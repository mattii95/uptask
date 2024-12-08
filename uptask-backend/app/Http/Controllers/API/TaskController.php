<?php

namespace App\Http\Controllers\API;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\TaskCollection;
use App\Http\Requests\Task\StoreRequest;
use App\Http\Requests\Task\UpdateRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $projectId)
    {
        $project = Project::find($projectId);
        $tasks = $project->tasks;

        return new TaskCollection($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(string $projectId, StoreRequest $request)
    {        
        $project = Project::where('id', $projectId)->first();

        if(auth()->user()->id !== $project->user_id) {
            return response()->json(['error' => 'Unauthorized access task'], 403);
        }

        $task = Task::create([
            'name' => $request->name,
            'description' => $request->description,
            'project_id' => $project->id
        ]);

        return response()->json(['data' => $task, 'message' => 'Created task succesful'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $projectId, string $taskId)
    {
        $task = Task::with(['completedByUser:id,name,email', 'notes'])->find($taskId);

        if(!Gate::allows('view', $task)) {
            return response()->json(['error' => 'Unauthorized access task'], 403);
        }

        if (intval($projectId) !== $task->project->id) {
            return response()->json(['error' => 'Invalid action'], 400);
        }
        return response()->json(['data' => $task]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(string $projectId, UpdateRequest $request, string $taskId)
    {
        $task = Task::find($taskId);

        if(!Gate::allows('update', $task)) {
            return response()->json(['error' => 'Unauthorized access task'], 403);
        }

        if (intval($projectId) !== $task->project->id) {
            return response()->json(['error' => 'Invalid action'], 400);
        }
        $task->update($request->validated());
        return response()->json(['data' => $task, 'message' => 'Updated task successful']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $projectId, string $taskId)
    {
        $task = Task::find($taskId);
        
        if(!Gate::allows('delete', $task)) {
            return response()->json(['error' => 'Unauthorized access task'], 403);
        }

        if (intval($projectId) !== $task->project->id) {
            return response()->json(['error' => 'Invalid action'], 400);
        }
        $result = $task->delete();
        return response()->json(['data' => $result, 'message' => 'Deleted task successful']);
    }

    /**
     * Actualiza el estado de la tarea
     */
    public function updateStatus(string $projectId, string $taskId, Request $request) {
        $request->validate([
            'status' => 'required|in:pending,onHold,inProgress,underReview,completed'
        ]);

        $task = Task::find($taskId);
        if (intval($projectId) !== $task->project->id) {
            return response()->json(['error' => 'Invalid action'], 400);
        }

        $completedBy = auth()->user()->id;
        if ($request->status == 'pending') {
            $completedBy = null;
        }

        $task->update(['status' => $request->status, 'completed_by' => $completedBy]);
        return response()->json(['data' => $task, 'message' => 'Updated status successful']);
    }
}
