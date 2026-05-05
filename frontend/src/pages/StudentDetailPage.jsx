import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { RiskScoreCard } from '../components/RiskComponents'
import { StatePanel } from '../components/StatePanel'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import { studentService } from '../services/apiService'
import { extractApiData, getErrorMessage } from '../utils/errors'
import { formatRiskScore } from '../utils/risk'

const AlertIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 9v4m0 4h.01M5.94 19h12.12a1 1 0 0 0 .88-1.47L12.88 6.1a1 1 0 0 0-1.76 0L5.06 17.53A1 1 0 0 0 5.94 19Z"
    />
  </svg>
)

export const StudentDetailPage = () => {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStudent()
  }, [id])

  const fetchStudent = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await studentService.getById(id)
      setStudent(extractApiData(response))
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'The selected student record could not be loaded.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <Card className="p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-10 w-64 rounded bg-slate-200" />
            <div className="h-4 w-48 rounded bg-slate-200" />
          </div>
        </Card>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="py-8">
        <StatePanel
          tone="danger"
          title="Student record unavailable"
          description={error || 'Student not found.'}
          actionLabel="Retry"
          onAction={fetchStudent}
          icon={<AlertIcon />}
        />
      </div>
    )
  }

  const riskScore = student.riskScore
  const grades = student.grades || []
  const violations = student.violations || []

  return (
    <div className="space-y-8 py-8">
      <SectionHeader
        eyebrow="Student Detail"
        title={student.name}
        description="Review the student's current risk posture, recent grades, and behavioral history to decide the next intervention."
        actions={
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-950/5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Class assignment
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {student.class?.name || 'Unassigned class'}
            </p>
            <p className="text-sm text-slate-500">{student.email}</p>
          </div>
        }
      />

      {riskScore && (
        <RiskScoreCard
          score={riskScore.total_score}
          riskLevel={riskScore.risk_level}
          academicScore={riskScore.academic_score}
          behavioralScore={riskScore.behavioral_score}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Academic Signal
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Performance snapshot
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Recent grades feeding the academic portion of the risk score.
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Academic score
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {formatRiskScore(riskScore?.academic_score)}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {grades.length > 0 ? (
              grades.slice(0, 5).map((grade) => (
                <div
                  key={grade.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{grade.subject}</p>
                    <p className="text-sm text-slate-500">
                      Semester {grade.semester} / {grade.academic_year}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{grade.score}</p>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No grades recorded for this student yet.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                Behavioral Signal
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Incident history
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Behavioral events contributing to the warning score.
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Behavioral score
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {formatRiskScore(riskScore?.behavioral_score)}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {violations.length > 0 ? (
              violations.slice(0, 5).map((violation) => (
                <div
                  key={violation.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-slate-900">{violation.description}</p>
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-rose-700">
                      {violation.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Reported by {violation.reported_by} on {violation.reported_date}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No behavioral violations recorded for this student.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
