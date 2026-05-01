import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentService } from '../services/apiService'
import { RiskBadge } from '../components/RiskComponents'
import { DashboardStatistics } from '../components/DashboardStatistics'

export const DashboardPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchStudents()
  }, [filter])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      let response
      if (filter === 'all') {
        response = await studentService.getAll()
      } else {
        response = await studentService.getByRiskLevel(filter)
      }
      setStudents(response.data.data)
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Student Dashboard
      </h1>

      <div className="mb-8">
        <DashboardStatistics />
      </div>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          All Students
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'high'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          High Risk
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'medium'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Medium Risk
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'low'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Low Risk
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading students...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Link
              to={`/students/${student.id}`}
              key={student.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
                {student.riskScore && (
                  <RiskBadge riskLevel={student.riskScore.risk_level} />
                )}
              </div>
              {student.riskScore && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Risk Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {student.riskScore.total_score?.toFixed(1) || 0}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
