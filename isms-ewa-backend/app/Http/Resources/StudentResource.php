<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'student_id' => $this->student_id,
            'name' => $this->name,
            'email' => $this->email,
            'gender' => $this->gender,
            'birth_date' => $this->birth_date,
            'address' => $this->address,
            'school_class' => new SchoolClassResource($this->whenLoaded('schoolClass')),
            'risk_score' => new RiskScoreResource($this->whenLoaded('riskScore')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
