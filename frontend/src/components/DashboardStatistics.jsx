import React, { useEffect, useState } from 'react'
import { dashboardStatisticsService } from '../services/dashboardService'
import { getErrorMessage } from '../utils/errors'
import { Card } from './ui/Card'
import { StatePanel } from './StatePanel'

const ChartBarIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 20V10m5 10V4m5 16v-7" />
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

const statConfigs = [
  {
    key: 'totalStudents',
    label: 'Total students',
    accent: 'text-cyan-700',
    surface: 'bg-cyan-50',
    icon: <ChartBarIcon />,
    value: (stats) => stats.totalStudents,
  },
  {
    key: 'highRisk',
    label: 'High risk',
    accent: 'text-rose-700',
    surface: 'bg-rose-50',
    icon: <AlertIcon />,
    value: (stats) => stats.riskStats.high,
  },
  {
    key: 'mediumRisk',
    label: 'Medium risk',
    accent: 'text-amber-700',
    surface: 'bg-amber-50',
    icon: <AlertIcon />,
    value: (stats) => stats.riskStats.medium,
  },
  {
    key: 'lowRisk',
    label: 'Low risk',
    accent: 'text-emerald-700',
    surface: 'bg-emerald-50',
    icon: <ChartBarIcon />,
    value: (stats) => stats.riskStats.low,
  },
  {
    key: 'averageRiskScore',
    label: 'Average risk score',
    accent: 'text-slate-900',
    surface: 'bg-slate-100',
    icon: <ChartBarIcon />,
    value: (stats) => Number(stats.averageRiskScore || 0).toFixed(1),
  },
]

const StatisticsCard = ({ label, value, icon, accent, surface }) => {
  return (
    <Card className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`text-3xl font-semibold ${accent}`}>{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${surface} ${accent}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

const StatisticsLoadingState = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="p-5">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-9 w-16 rounded bg-slate-200" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export const DashboardStatistics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await dashboardStatisticsService.getStudentStatistics()
      setStats(data)
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'The dashboard could not load student statistics right now.'
        )
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <StatisticsLoadingState />
  }

  if (!stats) {
    return (
      <StatePanel
        tone="danger"
        title="Statistics unavailable"
        description={`${error || 'The dashboard could not load student statistics.'} Try again to refresh the latest totals and risk distribution.`}
        actionLabel="Retry"
        onAction={loadStatistics}
        icon={<AlertIcon />}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {statConfigs.map((config) => (
        <StatisticsCard
          key={config.key}
          label={config.label}
          value={config.value(stats)}
          icon={config.icon}
          accent={config.accent}
          surface={config.surface}
        />
      ))}
    </div>
  )
}
