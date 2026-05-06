<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ViolationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student' => new StudentResource($this->whenLoaded('student')),
            'description' => $this->description,
            'severity' => $this->severity,
            'reported_by' => new UserResource($this->whenLoaded('reporter')),
            'reported_date' => $this->reported_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
