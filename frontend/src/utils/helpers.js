import { normalizeRiskLevel } from './risk'

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const getRiskColor = (riskLevel) => {
  switch (normalizeRiskLevel(riskLevel)) {
    case 'low':
      return '#10b981'
    case 'medium':
      return '#f59e0b'
    case 'high':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

export const getScoreBgClass = (riskLevel) => {
  switch (normalizeRiskLevel(riskLevel)) {
    case 'low':
      return 'bg-risk-low'
    case 'medium':
      return 'bg-risk-medium'
    case 'high':
      return 'bg-risk-high'
    default:
      return 'bg-gray-400'
  }
}
