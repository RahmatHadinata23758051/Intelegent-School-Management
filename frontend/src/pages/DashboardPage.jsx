import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardStatistics } from '../components/DashboardStatistics'
import { RiskBadge, RiskProgressBar } from '../components/RiskComponents'
import { StatePanel } from '../components/StatePanel'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../components/ui/Table'
import { studentService } from '../services/apiService'
import { extractApiData, getErrorMessage } from '../utils/errors'
import { formatRiskScore, getRiskInsight, normalizeRiskLevel } from '../utils/risk'

const PAGE_SIZE = 6

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
    />
  </svg>
)

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

const EmptyIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 17h6m-6-4h6m2 8H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.17A2 2 0 0 1 13.6 3.6L18.4 8.4A2 2 0 0 1 19 9.83V19a2 2 0 0 1-2 2Z"
    />
  </svg>
)

const RosterLoadingState = () => {
  return (
    <Card className="overflow-hidden">
      <div className="animate-pulse divide-y divide-slate-200">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid gap-4 px-6 py-5 md:grid-cols-[1.2fr,0.6fr,0.9fr,1fr,0.4fr]">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-40 rounded bg-slate-200" />
            </div>
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-4 w-14 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export const DashboardPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filter])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await studentService.getAll()
      setStudents(extractApiData(response) || [])
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'The roster could not be loaded. Check the API connection and try again.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const studentsWithInsights = students.map((student) => {
    const normalizedRiskLevel = normalizeRiskLevel(student.riskScore?.risk_level)

    return {
      ...student,
      normalizedRiskLevel,
      riskInsight: getRiskInsight(student.riskScore),
      totalRiskScore: Number(student.riskScore?.total_score || 0),
    }
  })

  const attentionStudents = [...studentsWithInsights]
    .sort((leftStudent, rightStudent) => rightStudent.totalRiskScore - leftStudent.totalRiskScore)
    .slice(0, 5)

  const academicConcernCount = studentsWithInsights.filter((student) => {
    const academicScore = Number(student.riskScore?.academic_score || 0)
    const behavioralScore = Number(student.riskScore?.behavioral_score || 0)

    return academicScore > 0 && academicScore >= behavioralScore
  }).length

  const behaviorConcernCount = studentsWithInsights.filter((student) => {
    const academicScore = Number(student.riskScore?.academic_score || 0)
    const behavioralScore = Number(student.riskScore?.behavioral_score || 0)

    return behavioralScore > academicScore
  }).length

  const filteredStudents = studentsWithInsights.filter((student) => {
    const matchesSearch =
      (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.student_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === 'all' ? true : student.normalizedRiskLevel === filter

    return matchesSearch && matchesFilter
  })

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <div className="space-y-8 py-8">
      <SectionHeader
        eyebrow="Student Monitoring"
        title="Early warning dashboard"
        description="Track student risk signals, identify the learners who need intervention first, and move from raw scores to actionable follow-up."
        actions={
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-950/5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Current roster
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{students.length} students</p>
          </div>
        }
      />

      <DashboardStatistics />

      <div className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                Attention Queue
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Students needing attention
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Highest-risk students are surfaced first so homeroom teachers can prioritize interventions.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {attentionStudents.length > 0 ? (
              attentionStudents.map((student, index) => (
                <Link
                  to={`/students/${student.id}`}
                  key={student.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-cyan-200 hover:bg-cyan-50/40"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                          <p className="text-sm text-slate-500">
                            {student.class?.name || 'Unassigned class'} / {student.student_id}
                          </p>
                        </div>
                      </div>
                    </div>
                    <RiskBadge riskLevel={student.normalizedRiskLevel} />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1fr,0.75fr]">
                    <RiskProgressBar
                      score={student.totalRiskScore}
                      riskLevel={student.normalizedRiskLevel}
                    />
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Key signal
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {student.riskInsight}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                No students have been scored yet. Seed data or create grade and violation records to populate the attention queue.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Signal Overview
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            What is driving current risk
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Use these cues to separate academic intervention from disciplinary follow-up.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Academic concern dominant</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{academicConcernCount}</p>
              <p className="mt-2 text-sm text-slate-600">
                Students whose academic score is the main risk driver.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Behavior concern dominant</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{behaviorConcernCount}</p>
              <p className="mt-2 text-sm text-slate-600">
                Students whose violations are pushing them into a warning state.
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Intervention guidance</p>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                Prioritize the attention queue first, then review whether each student needs academic coaching, behavior follow-up, or both.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <SectionHeader
          eyebrow="Student Roster"
          title="Search and review student risk"
          description="Filter the full roster by risk tier, search by name or class, and inspect each student's score before opening the detail view."
        />

        <Card className="p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr,16rem]">
            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by student, email, ID, or class"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="all">All risk tiers</option>
              <option value="high">High risk</option>
              <option value="medium">Medium risk</option>
              <option value="low">Low risk</option>
            </select>
          </div>
        </Card>

        {error ? (
          <StatePanel
            tone="danger"
            title="Student roster unavailable"
            description={error}
            actionLabel="Retry"
            onAction={fetchStudents}
            icon={<AlertIcon />}
          />
        ) : loading ? (
          <RosterLoadingState />
        ) : paginatedStudents.length === 0 ? (
          <StatePanel
            title="No matching students"
            description="Adjust the search term or change the risk filter to view more students."
            icon={<EmptyIcon />}
          />
        ) : (
          <>
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Student</TableHeaderCell>
                  <TableHeaderCell>Class</TableHeaderCell>
                  <TableHeaderCell>Risk level</TableHeaderCell>
                  <TableHeaderCell>Risk score</TableHeaderCell>
                  <TableHeaderCell className="text-right">Detail</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{student.email}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                          {student.student_id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-800">
                          {student.class?.name || 'Unassigned class'}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Grade {student.class?.grade_level || 'N/A'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <RiskBadge riskLevel={student.normalizedRiskLevel} />
                        <p className="text-sm text-slate-600">{student.riskInsight}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[12rem] space-y-2">
                        <RiskProgressBar
                          score={student.totalRiskScore}
                          riskLevel={student.normalizedRiskLevel}
                          compact
                        />
                        <p className="text-sm text-slate-500">
                          Score {formatRiskScore(student.totalRiskScore)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/students/${student.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm shadow-slate-950/5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filteredStudents.length)} of {filteredStudents.length} students
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safeCurrentPage === 1}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-cyan-300 hover:text-cyan-700"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-slate-500">
                  Page {safeCurrentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-cyan-300 hover:text-cyan-700"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
