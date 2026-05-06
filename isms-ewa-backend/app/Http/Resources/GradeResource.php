<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeResource extends JsonResource
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
            'subject' => $this->subject,
            'score' => $this->score,
            'semester' => $this->semester,
            'academic_year' => $this->academic_year,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
