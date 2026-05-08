<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        \App\Models\AcademicYear::class => \App\Policies\AcademicYearPolicy::class,
        \App\Models\Semester::class => \App\Policies\SemesterPolicy::class,
        \App\Models\SchoolClass::class => \App\Policies\SchoolClassPolicy::class,
        \App\Models\Student::class => \App\Policies\StudentPolicy::class,
        \App\Models\Grade::class => \App\Policies\GradePolicy::class,
        \App\Models\Violation::class => \App\Policies\ViolationPolicy::class,
        \App\Models\RiskScore::class => \App\Policies\RiskScorePolicy::class,
        \App\Models\ClassSubject::class => \App\Policies\ClassSubjectPolicy::class,
        \App\Models\TeacherProfile::class => \App\Policies\TeacherProfilePolicy::class,
        \App\Models\Subject::class => \App\Policies\SubjectPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Register dashboard policy gate
        \Illuminate\Support\Facades\Gate::define('view-dashboard', function (\App\Models\User $user) {
            return (new \App\Policies\DashboardPolicy())->viewStatistics($user);
        });
    }
}
