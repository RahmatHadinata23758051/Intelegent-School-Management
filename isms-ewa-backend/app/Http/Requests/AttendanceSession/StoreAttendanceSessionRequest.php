<?php

namespace App\Http\Requests\AttendanceSession;

use App\Models\AcademicYear;
use App\Models\AttendanceSession;
use App\Models\Semester;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAttendanceSessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by policy
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'school_class_id' => ['required', 'integer', 'exists:school_classes,id'],
            'academic_year_id' => ['required', 'integer', 'exists:academic_years,id'],
            'semester_id' => ['required', 'integer', 'exists:semesters,id'],
            'session_date' => ['required', 'date'],
            'session_type' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate academic year is active
            if ($this->academic_year_id) {
                $academicYear = AcademicYear::find($this->academic_year_id);
                if ($academicYear && !$academicYear->is_active) {
                    $validator->errors()->add('academic_year_id', 'Tahun ajaran harus aktif.');
                }
            }

            // Validate semester is active
            if ($this->semester_id) {
                $semester = Semester::find($this->semester_id);
                if ($semester && !$semester->is_active) {
                    $validator->errors()->add('semester_id', 'Semester harus aktif.');
                }

                // Validate semester belongs to academic year
                if ($this->academic_year_id && $semester && $semester->academic_year_id != $this->academic_year_id) {
                    $validator->errors()->add('semester_id', 'Semester harus milik tahun ajaran yang dipilih.');
                }

                // Validate session date is within semester range
                if ($this->session_date && $semester) {
                    $sessionDate = \Carbon\Carbon::parse($this->session_date);
                    $startDate = \Carbon\Carbon::parse($semester->start_date);
                    $endDate = \Carbon\Carbon::parse($semester->end_date);

                    if ($sessionDate->lt($startDate) || $sessionDate->gt($endDate)) {
                        $validator->errors()->add('session_date', 'Tanggal sesi harus berada dalam rentang semester.');
                    }
                }
            }

            // Validate unique combination
            if ($this->school_class_id && $this->session_date) {
                $sessionType = $this->session_type ?? 'daily';
                $exists = AttendanceSession::where('school_class_id', $this->school_class_id)
                    ->where('session_date', $this->session_date)
                    ->where('session_type', $sessionType)
                    ->exists();

                if ($exists) {
                    $validator->errors()->add('session_date', 'Sesi absensi untuk kelas dan tanggal ini sudah ada.');
                }
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'school_class_id.required' => 'Kelas wajib diisi.',
            'school_class_id.exists' => 'Kelas tidak valid.',
            'academic_year_id.required' => 'Tahun ajaran wajib diisi.',
            'academic_year_id.exists' => 'Tahun ajaran tidak valid.',
            'semester_id.required' => 'Semester wajib diisi.',
            'semester_id.exists' => 'Semester tidak valid.',
            'session_date.required' => 'Tanggal sesi wajib diisi.',
            'session_date.date' => 'Tanggal sesi tidak valid.',
        ];
    }
}
