import React from 'react'

export const RiskBadge = ({ riskLevel }) => {
  const badgeClass = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
  }[riskLevel] || 'badge-low'

  return <span className={badgeClass}>{riskLevel?.toUpperCase()}</span>
}

export const RiskScoreCard = ({ score, riskLevel }) => {
  const getScoreColor = (level) => {
    switch (level) {
      case 'low':
        return 'text-risk-low'
      case 'medium':
        return 'text-risk-medium'
      case 'high':
        return 'text-risk-high'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Score</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-4xl font-bold ${getScoreColor(riskLevel)}`}>
            {score?.toFixed(1)}
          </p>
          <RiskBadge riskLevel={riskLevel} />
        </div>
      </div>
    </div>
  )
}
