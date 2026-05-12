<?php

namespace App\Http\Requests\WeeklyGrade;

use App\Models\AcademicYear;
use App\Models\GradeComponent;
use App\Models\Semester;
use App\Models\Student;
use App\Models\TeacherSubjectAssignment;
use Illuminate\Foundation\Http\FormRequest;

class BulkStoreWeeklyGradeRequest extends FormRequest
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
            'teacher_subject_assignment_id' => 'required|exists:teacher_subject_assignments,id',
            'grade_component_id' => 'required|exists:grade_components,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_id' => 'required|exists:semesters,id',
            'week_number' => 'required|integer|min:1|max:52',
            'assessment_date' => 'nullable|date',
            'grades' => 'required|array|min:1',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.score' => 'required|numeric|min:0|max:100',
            'grades.*.notes' => 'nullable|string',
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

            // Validate all students are in the class of the assignment
            if ($assignment && $this->has('grades')) {
                $classSubject = $assignment->classSubject;
                if ($classSubject) {
                    $studentIds = collect($this->grades)->pluck('student_id')->toArray();
                    $invalidStudents = Student::whereIn('id', $studentIds)
                        ->where('school_class_id', '!=', $classSubject->school_class_id)
                        ->count();

                    if ($invalidStudents > 0) {
                        $validator->errors()->add('grades', 'Beberapa siswa tidak berada di kelas assignment');
                    }
                }
            }

            // Check for duplicate student_id in payload
            if ($this->has('grades')) {
                $studentIds = collect($this->grades)->pluck('student_id')->toArray();
                if (count($studentIds) !== count(array_unique($studentIds))) {
                    $validator->errors()->add('grades', 'Terdapat student_id duplikat dalam payload');
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
            'teacher_subject_assignment_id.required' => 'Assignment guru wajib dipilih',
            'grade_component_id.required' => 'Komponen nilai wajib dipilih',
            'academic_year_id.required' => 'Tahun ajaran wajib dipilih',
            'semester_id.required' => 'Semester wajib dipilih',
            'week_number.required' => 'Minggu wajib diisi',
            'week_number.min' => 'Minggu minimal 1',
            'week_number.max' => 'Minggu maksimal 52',
            'grades.required' => 'Data nilai wajib diisi',
            'grades.min' => 'Minimal 1 nilai harus diisi',
            'grades.*.student_id.required' => 'Siswa wajib dipilih',
            'grades.*.student_id.exists' => 'Siswa tidak ditemukan',
            'grades.*.score.required' => 'Nilai wajib diisi',
            'grades.*.score.min' => 'Nilai minimal 0',
            'grades.*.score.max' => 'Nilai maksimal 100',
        ];
    }
}
