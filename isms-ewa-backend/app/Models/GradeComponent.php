<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GradeComponent extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'default_weight',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'default_weight' => 'decimal:2',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Relationship: Grade component has many weekly grades
     */
    public function weeklyGrades()
    {
        return $this->hasMany(WeeklyGrade::class);
    }

    /**
     * Scope: Filter active grade components
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Search by code or name
     */
    public function scopeSearch($query, $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('code', 'like', "%{$search}%")
              ->orWhere('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Scope: Filter by status
     */
    public function scopeByStatus($query, $status)
    {
        if ($status === 'active') {
            return $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            return $query->where('is_active', false);
        }
        
        return $query; // 'all' or empty
    }
}
