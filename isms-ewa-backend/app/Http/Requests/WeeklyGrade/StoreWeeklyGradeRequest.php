<?php

namespace App\Http\Requests\WeeklyGrade;

use App\Models\AcademicYear;
use App\Models\GradeComponent;
use App\Models\Semester;
use App\Models\Student;
use App\Models\TeacherSubjectAssignment;
use Illuminate\Foundation\Http\FormRequest;

class StoreWeeklyGradeRequest extends FormRequest
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
            'student_id' => 'required|exists:students,id',
            'teacher_subject_assignment_id' => 'required|exists:teacher_subject_assignments,id',
            'grade_component_id' => 'required|exists:grade_components,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_id' => 'required|exists:semesters,id',
            'week_number' => 'required|integer|min:1|max:52',
            'assessment_date' => 'nullable|date',
            'score' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate teacher subject assignment is active
            $assignment = TeacherSubjectAssignment::find($this->teacher_subject_assignment_id);
            if ($assignment && !$assignment->is_active) {
                $validator->errors()->add('teacher_subject_assignment_id', 'Assignment guru tidak aktif');
            }

            // Validate grade component is active
            $component = GradeComponent::find($this->grade_component_id);
            if ($component && !$component->is_active) {
                $validator->errors()->add('grade_component_id', 'Komponen nilai tidak aktif');
            }

            // Validate academic year is active
            $academicYear = AcademicYear::find($this->academic_year_id);
            if ($academicYear && !$academicYear->is_active) {
                $validator->errors()->add('academic_year_id', 'Tahun ajaran tidak aktif');
            }

            // Validate semester is active
            $semester = Semester::find($this->semester_id);
            if ($semester && !$semester->is_active) {
                $validator->errors()->add('semester_id', 'Semester tidak aktif');
            }

            // Validate semester belongs to academic year
            if ($semester && $semester->academic_year_id != $this->academic_year_id) {
                $validator->errors()->add('semester_id', 'Semester tidak sesuai dengan tahun ajaran');
            }

            // Validate student is in the class of the assignment
            if ($assignment) {
                $classSubject = $assignment->classSubject;
                if ($classSubject) {
                    $student = Student::find($this->student_id);
                    if ($student && $student->school_class_id != $classSubject->school_class_id) {
                        $validator->errors()->add('student_id', 'Siswa tidak berada di kelas assignment');
                    }
                }
            }

            // Check for duplicate (unique combination)
            $exists = \App\Models\WeeklyGrade::where('student_id', $this->student_id)
                ->where('teacher_subject_assignment_id', $this->teacher_subject_assignment_id)
                ->where('grade_component_id', $this->grade_component_id)
                ->where('academic_year_id', $this->academic_year_id)
                ->where('semester_id', $this->semester_id)
                ->where('week_number', $this->week_number)
                ->exists();

            if ($exists) {
                $validator->errors()->add('week_number', 'Nilai untuk minggu ini sudah ada');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'student_id.required' => 'Siswa wajib dipilih',
            'student_id.exists' => 'Siswa tidak ditemukan',
            'teacher_subject_assignment_id.required' => 'Assignment guru wajib dipilih',
            'teacher_subject_assignment_id.exists' => 'Assignment guru tidak ditemukan',
            'grade_component_id.required' => 'Komponen nilai wajib dipilih',
            'grade_component_id.exists' => 'Komponen nilai tidak ditemukan',
            'academic_year_id.required' => 'Tahun ajaran wajib dipilih',
            'academic_year_id.exists' => 'Tahun ajaran tidak ditemukan',
            'semester_id.required' => 'Semester wajib dipilih',
            'semester_id.exists' => 'Semester tidak ditemukan',
            'week_number.required' => 'Minggu wajib diisi',
            'week_number.min' => 'Minggu minimal 1',
            'week_number.max' => 'Minggu maksimal 52',
            'score.required' => 'Nilai wajib diisi',
            'score.min' => 'Nilai minimal 0',
            'score.max' => 'Nilai maksimal 100',
        ];
    }
}
