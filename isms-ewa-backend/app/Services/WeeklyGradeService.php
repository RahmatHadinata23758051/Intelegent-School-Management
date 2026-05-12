<?php

namespace App\Services;

use App\Models\WeeklyGrade;
use App\Models\TeacherSubjectAssignment;
use Illuminate\Support\Facades\DB;

class WeeklyGradeService
{
    /**
     * Bulk upsert weekly grades for a session
     * 
     * @param array $data Bulk data with teacher_subject_assignment_id, grade_component_id, etc.
     * @param int $recordedBy User ID who recorded the grades
     * @return array Statistics of created and updated records
     */
    public function bulkUpsertWeeklyGrades(array $data, int $recordedBy): array
    {
        $created = 0;
        $updated = 0;

        DB::beginTransaction();
        try {
            foreach ($data['grades'] as $gradeData) {
                $weeklyGrade = WeeklyGrade::updateOrCreate(
                    [
                        'student_id' => $gradeData['student_id'],
                        'teacher_subject_assignment_id' => $data['teacher_subject_assignment_id'],
                        'grade_component_id' => $data['grade_component_id'],
                        'academic_year_id' => $data['academic_year_id'],
                        'semester_id' => $data['semester_id'],
                        'week_number' => $data['week_number'],
                    ],
                    [
                        'score' => $gradeData['score'],
                        'notes' => $gradeData['notes'] ?? null,
                        'assessment_date' => $data['assessment_date'] ?? now()->toDateString(),
                        'recorded_by' => $recordedBy,
                    ]
                );

                if ($weeklyGrade->wasRecentlyCreated) {
                    $created++;
                } else {
                    $updated++;
                }
            }

            DB::commit();

            return [
                'created' => $created,
                'updated' => $updated,
                'total' => $created + $updated,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get class weekly grades recap
     * 
     * @param int $classId School class ID
     * @param array $filters Filters (subject_id, teacher_profile_id, grade_component_id, etc.)
     * @return array Recap data
     */
    public function getClassWeeklyGradesRecap(int $classId, array $filters = []): array
    {
        $query = WeeklyGrade::with([
            'student',
            'teacherSubjectAssignment.classSubject.subject',
            'gradeComponent',
        ])
            ->byClass($classId)
            ->bySubject($filters['subject_id'] ?? null)
            ->byTeacher($filters['teacher_profile_id'] ?? null)
            ->byGradeComponent($filters['grade_component_id'] ?? null)
            ->byAcademicYear($filters['academic_year_id'] ?? null)
            ->bySemester($filters['semester_id'] ?? null)
            ->byWeek($filters['week_number'] ?? null)
            ->byDateRange($filters['date_from'] ?? null, $filters['date_to'] ?? null);

        $grades = $query->get();

        // Calculate statistics
        $totalRecords = $grades->count();
        $averageScore = $grades->avg('score');
        $minScore = $grades->min('score');
        $maxScore = $grades->max('score');
        $lowScoreCount = $grades->where('score', '<', 70)->count();

        // Group by student
        $studentGrades = $grades->groupBy('student_id')->map(function ($studentGrades) {
            $student = $studentGrades->first()->student;
            return [
                'student_id' => $student->id,
                'student_name' => $student->name,
                'student_number' => $student->student_id,
                'average_score' => round($studentGrades->avg('score'), 2),
                'min_score' => $studentGrades->min('score'),
                'max_score' => $studentGrades->max('score'),
                'total_records' => $studentGrades->count(),
                'low_score_count' => $studentGrades->where('score', '<', 70)->count(),
            ];
        })->values();

        return [
            'class_average_score' => round($averageScore, 2),
            'total_students' => $studentGrades->count(),
            'total_records' => $totalRecords,
            'min_score' => $minScore,
            'max_score' => $maxScore,
            'low_score_students_count' => $studentGrades->where('low_score_count', '>', 0)->count(),
            'students' => $studentGrades,
        ];
    }

    /**
     * Get student weekly grades recap
     * 
     * @param int $studentId Student ID
     * @param array $filters Filters (subject_id, grade_component_id, etc.)
     * @return array Recap data
     */
    public function getStudentWeeklyGradesRecap(int $studentId, array $filters = []): array
    {
        $query = WeeklyGrade::with([
            'teacherSubjectAssignment.classSubject.subject',
            'gradeComponent',
            'academicYear',
            'semester',
        ])
            ->byStudent($studentId)
            ->bySubject($filters['subject_id'] ?? null)
            ->byGradeComponent($filters['grade_component_id'] ?? null)
            ->byAcademicYear($filters['academic_year_id'] ?? null)
            ->bySemester($filters['semester_id'] ?? null)
            ->byWeek($filters['week_number'] ?? null)
            ->byDateRange($filters['date_from'] ?? null, $filters['date_to'] ?? null);

        $grades = $query->get();

        // Calculate statistics
        $totalRecords = $grades->count();
        $averageScore = $grades->avg('score');
        $minScore = $grades->min('score');
        $maxScore = $grades->max('score');
        $lowScoreCount = $grades->where('score', '<', 70)->count();

        // Group by subject
        $subjectGrades = $grades->groupBy(function ($grade) {
            return $grade->teacherSubjectAssignment->classSubject->subject_id;
        })->map(function ($subjectGrades) {
            $subject = $subjectGrades->first()->teacherSubjectAssignment->classSubject->subject;
            return [
                'subject_id' => $subject->id,
                'subject_name' => $subject->name,
                'subject_code' => $subject->code,
                'average_score' => round($subjectGrades->avg('score'), 2),
                'min_score' => $subjectGrades->min('score'),
                'max_score' => $subjectGrades->max('score'),
                'total_records' => $subjectGrades->count(),
                'low_score_count' => $subjectGrades->where('score', '<', 70)->count(),
            ];
        })->values();

        return [
            'average_score' => round($averageScore, 2),
            'min_score' => $minScore,
            'max_score' => $maxScore,
            'total_records' => $totalRecords,
            'low_score_count' => $lowScoreCount,
            'subjects' => $subjectGrades,
        ];
    }

    /**
     * Get weekly grades summary
     * 
     * @param array $filters Filters (academic_year_id, semester_id)
     * @return array Summary data
     */
    public function getWeeklyGradesSummary(array $filters = []): array
    {
        $query = WeeklyGrade::query()
            ->byAcademicYear($filters['academic_year_id'] ?? null)
            ->bySemester($filters['semester_id'] ?? null);

        $grades = $query->get();

        $totalRecords = $grades->count();
        $averageScore = $grades->avg('score');
        $totalStudents = $grades->pluck('student_id')->unique()->count();
        $totalSubjects = $grades->map(function ($grade) {
            return $grade->teacherSubjectAssignment->classSubject->subject_id;
        })->unique()->count();

        // Score distribution
        $scoreRanges = [
            '90-100' => $grades->whereBetween('score', [90, 100])->count(),
            '80-89' => $grades->whereBetween('score', [80, 89])->count(),
            '70-79' => $grades->whereBetween('score', [70, 79])->count(),
            '60-69' => $grades->whereBetween('score', [60, 69])->count(),
            '0-59' => $grades->where('score', '<', 60)->count(),
        ];

        return [
            'total_records' => $totalRecords,
            'average_score' => round($averageScore, 2),
            'total_students' => $totalStudents,
            'total_subjects' => $totalSubjects,
            'score_distribution' => $scoreRanges,
            'low_score_count' => $grades->where('score', '<', 70)->count(),
            'low_score_percentage' => $totalRecords > 0 
                ? round(($grades->where('score', '<', 70)->count() / $totalRecords) * 100, 2) 
                : 0,
        ];
    }
}
