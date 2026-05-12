<?php

namespace App\Http\Requests\Attendance;

use App\Models\Attendance;
use App\Models\AttendanceSession;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAttendanceRequest extends FormRequest
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
            'attendance_session_id' => ['required', 'integer', 'exists:attendance_sessions,id'],
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'status' => ['required', Rule::in(Attendance::getValidStatuses())],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate session is not locked
            if ($this->attendance_session_id) {
                $session = AttendanceSession::find($this->attendance_session_id);
                if ($session && $session->is_locked) {
                    $validator->errors()->add('attendance_session_id', 'Sesi absensi terkunci tidak dapat diubah.');
                }

                // Validate student belongs to session class
                if ($this->student_id && $session) {
                    $student = \App\Models\Student::find($this->student_id);
                    if ($student && $student->school_class_id != $session->school_class_id) {
                        $validator->errors()->add('student_id', 'Siswa tidak berada di kelas sesi absensi ini.');
                    }
                }
            }

            // Validate unique attendance
            if ($this->attendance_session_id && $this->student_id) {
                $exists = Attendance::where('attendance_session_id', $this->attendance_session_id)
                    ->where('student_id', $this->student_id)
                    ->exists();

                if ($exists) {
                    $validator->errors()->add('student_id', 'Absensi untuk siswa ini sudah ada di sesi ini.');
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
            'attendance_session_id.required' => 'Sesi absensi wajib diisi.',
            'attendance_session_id.exists' => 'Sesi absensi tidak valid.',
            'student_id.required' => 'Siswa wajib diisi.',
            'student_id.exists' => 'Siswa tidak valid.',
            'status.required' => 'Status absensi wajib diisi.',
            'status.in' => 'Status absensi tidak valid.',
        ];
    }
}
