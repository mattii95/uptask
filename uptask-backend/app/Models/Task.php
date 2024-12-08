<?php

namespace App\Models;

use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'project_id',
        'completed_by'
    ];

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function completedByUser() {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function notes() {
        return $this->hasMany(Note::class)->with('user:id,name,email');
    }

}
