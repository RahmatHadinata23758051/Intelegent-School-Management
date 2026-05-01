import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { studentService, gradeService, violationService } from '../services/apiService'
import { RiskScoreCard } from '../components/RiskComponents'

export const StudentDetailPage = () => {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [grades, setGrades] = useState([])
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentData()
  }, [id])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      const [studentRes, gradesRes, violationsRes] = await Promise.all([
        studentService.getById(id),
        gradeService.getByStudent(id),
        violationService.getByStudent(id),
      ])

      setStudent(studentRes.data.data)
      setGrades(gradesRes.data.data || [])
      setViolations(violationsRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch student data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!student) {
    return <div className="p-8 text-center text-red-600">Student not found</div>
  }

  const riskScore = student.riskScore

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{student.name}</h1>
        <p className="text-gray-600">{student.email}</p>
      </div>

      {riskScore && (
        <div className="mb-8">
          <RiskScoreCard
            score={riskScore.total_score}
            riskLevel={riskScore.risk_level}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Academic Performance
          </h2>
          {riskScore && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Academic Score:</span>
                <span className="font-semibold text-gray-800">
                  {riskScore.academic_score?.toFixed(1) || 0}
                </span>
              </div>
            </div>
          )}
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Recent Grades</h3>
            {grades.length > 0 ? (
              <ul className="space-y-2">
                {grades.slice(0, 5).map((grade) => (
                  <li
                    key={grade.id}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>{grade.subject}</span>
                    <span className="font-semibold">{grade.score}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No grades recorded</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Behavioral Records
          </h2>
          {riskScore && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Behavioral Score:</span>
                <span className="font-semibold text-gray-800">
                  {riskScore.behavioral_score?.toFixed(1) || 0}
                </span>
              </div>
            </div>
          )}
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Recent Violations
            </h3>
            {violations.length > 0 ? (
              <ul className="space-y-3">
                {violations.slice(0, 5).map((violation) => (
                  <li key={violation.id} className="text-sm border-l-4 border-red-400 pl-3">
                    <p className="font-semibold text-gray-700">
                      {violation.severity?.toUpperCase()}
                    </p>
                    <p className="text-gray-600">{violation.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No violations recorded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
