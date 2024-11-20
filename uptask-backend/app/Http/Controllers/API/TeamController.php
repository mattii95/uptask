<?php

namespace App\Http\Controllers\API;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Project;

class TeamController extends Controller
{

    public function store(string $projectId, Request $request)
    {
        $validate = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $project = Project::findOrFail($projectId);

        $exists = $project->collaborators()->where('user_id', $validate['user_id'])->exists();
        if ($exists) {
            return response()->json(['error' => 'El usuario ya es colaborador de este proyecto'], 422);
        }

        $project->collaborators()->attach($validate['user_id']);

        return response()->json('Colaborador agregado exitosamente');
    }


    public function getProjectTeam(string $projectId)
    {
        $project = Project::findOrFail($projectId);
        return response()->json($project->collaborators);
    }

    public function findMemberByEmail(Request $request) {
        $validate = $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $validate['email'])->first();

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 400);
        }

        return response()->json($user);
    }

    public function removeMemberById(string $projectId, Request $request) {
        $validate = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $project = Project::findOrFail($projectId);

        $exists = $project->collaborators()->where('user_id', $validate['user_id'])->exists();
        if (!$exists) {
            return response()->json(['error' => 'El usuario no existe en el proyecto'], 422);
        }

        $project->collaborators()->detach($validate['user_id']);

        return response()->json('Colaborador eliminado exitosamente');

    }
}
