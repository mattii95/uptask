<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Project;

class ProjectPolicy
{
    public function __construct()
    {
        //
    }

    public function show(User $user, Project $project) : bool 
    {
        return $user->id == $project->user_id;
    }

    public function update(User $user, Project $project) : bool
    {
        return $user->id == $project->user_id;
    }

    public function delete(User $user, Project $project) : bool
    {
        return $user->id == $project->user_id;
    }
}
