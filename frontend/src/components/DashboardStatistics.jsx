import React, { useState, useEffect } from 'react'
import { dashboardStatisticsService } from '../services/dashboardService'

export const StatisticsCard = ({ label, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderColor: color }}>
      <p className="text-gray-600 text-sm font-semibold mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  )
}

export const DashboardStatistics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      const data = await dashboardStatisticsService.getStudentStatistics()
      setStats(data)
    } catch (error) {
      console.error('Failed to load statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading statistics...</div>
  }

  if (!stats) {
    return <div className="text-center py-8 text-red-600">Failed to load statistics</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatisticsCard label="Total Students" value={stats.totalStudents} color="#3b82f6" />
      <StatisticsCard
        label="High Risk"
        value={stats.riskStats.high}
        color="#ef4444"
      />
      <StatisticsCard
        label="Medium Risk"
        value={stats.riskStats.medium}
        color="#f59e0b"
      />
      <StatisticsCard
        label="Low Risk"
        value={stats.riskStats.low}
        color="#10b981"
      />
      <StatisticsCard
        label="Avg Risk Score"
        value={stats.averageRiskScore}
        color="#8b5cf6"
      />
    </div>
  )
}
