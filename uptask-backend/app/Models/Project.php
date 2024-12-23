<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_name',
        'client_name',
        'description',
        'user_id'
    ];

    public function tasks() {
        return $this->hasMany(Task::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function collaborators()
    {
        return $this->belongsToMany(User::class, 'project_teams');
    }
}
