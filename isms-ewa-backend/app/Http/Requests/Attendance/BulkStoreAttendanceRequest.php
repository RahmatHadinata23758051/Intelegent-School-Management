<?php

namespace App\Http\Requests\Attendance;

use App\Models\Attendance;
use App\Models\AttendanceSession;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkStoreAttendanceRequest extends FormRequest
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
            'attendances' => ['required', 'array', 'min:1'],
            'attendances.*.student_id' => ['required', 'integer', 'exists:students,id'],
            'attendances.*.status' => ['required', Rule::in(Attendance::getValidStatuses())],
            'attendances.*.notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $attendanceSession = $this->route('attendanceSession');

            // Validate session is not locked
            if ($attendanceSession && $attendanceSession->is_locked) {
                $validator->errors()->add('attendances', 'Sesi absensi terkunci tidak dapat diubah.');
                return;
            }

            // Validate no duplicate student_id in payload
            $studentIds = collect($this->attendances)->pluck('student_id')->toArray();
            if (count($studentIds) !== count(array_unique($studentIds))) {
                $validator->errors()->add('attendances', 'Tidak boleh ada siswa yang duplikat dalam satu request.');
            }

            // Validate all students belong to session class
            if ($attendanceSession && $this->attendances) {
                foreach ($this->attendances as $index => $attendanceData) {
                    $student = \App\Models\Student::find($attendanceData['student_id']);
                    if ($student && $student->school_class_id != $attendanceSession->school_class_id) {
                        $validator->errors()->add(
                            "attendances.{$index}.student_id",
                            'Siswa tidak berada di kelas sesi absensi ini.'
                        );
                    }
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
            'attendances.required' => 'Data absensi wajib diisi.',
            'attendances.array' => 'Data absensi harus berupa array.',
            'attendances.min' => 'Minimal harus ada 1 data absensi.',
            'attendances.*.student_id.required' => 'ID siswa wajib diisi.',
            'attendances.*.student_id.exists' => 'Siswa tidak valid.',
            'attendances.*.status.required' => 'Status absensi wajib diisi.',
            'attendances.*.status.in' => 'Status absensi tidak valid.',
        ];
    }
}
