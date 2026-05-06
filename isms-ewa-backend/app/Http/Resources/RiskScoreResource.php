<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RiskScoreResource extends JsonResource
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
            'academic_score' => $this->academic_score,
            'behavioral_score' => $this->behavioral_score,
            'total_score' => $this->total_score,
            'risk_level' => $this->risk_level,
            'last_updated' => $this->last_updated,
        ];
    }
}
