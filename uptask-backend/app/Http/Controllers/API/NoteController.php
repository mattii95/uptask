<?php

namespace App\Http\Controllers\API;

use App\Models\Note;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Note\StoreRequest;
use App\Http\Requests\Note\UpdateRequest;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $projectId, string $taskId)
    {
        $task = Task::find($taskId);
        $notes = $task->notes;
        return response()->json(['data' => $notes]);
    }

    public function store(string $projectId, string $taskId, StoreRequest $request)
    {
        $note = Note::create([
            'content' => $request->content,
            'user_id' => auth()->user()->id,
            'task_id' => $taskId
        ]);
        return response()->json(['data' => $note, 'message' => 'Created note succesful'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Note $note)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $projectId, string $taskId, string $noteId)
    {
        $note = Note::find($noteId);

        if (!$note) {
            return response()->json(['error' => 'Note not found'], 404);
        }

        if(auth()->user()->id !== $note->user_id) {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        $result = $note->delete();
        return response()->json('Deleted note successful');
    }
}
