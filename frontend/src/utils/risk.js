export const normalizeRiskLevel = (riskLevel) => {
  const normalizedLevel = String(riskLevel || '').trim().toLowerCase()

  if (normalizedLevel === 'high' || normalizedLevel === 'high risk') {
    return 'high'
  }

  if (normalizedLevel === 'medium' || normalizedLevel === 'warning') {
    return 'medium'
  }

  return 'low'
}

export const getRiskLabel = (riskLevel) => {
  const normalizedLevel = normalizeRiskLevel(riskLevel)

  return {
    low: 'Low risk',
    medium: 'Medium risk',
    high: 'High risk',
  }[normalizedLevel]
}

export const getRiskTone = (riskLevel) => {
  const normalizedLevel = normalizeRiskLevel(riskLevel)

  return {
    low: {
      badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
      text: 'text-emerald-700',
      progress: 'bg-emerald-500',
      marker: 'bg-emerald-500',
    },
    medium: {
      badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
      text: 'text-amber-700',
      progress: 'bg-amber-500',
      marker: 'bg-amber-500',
    },
    high: {
      badge: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
      text: 'text-rose-700',
      progress: 'bg-rose-500',
      marker: 'bg-rose-500',
    },
  }[normalizedLevel]
}

export const formatRiskScore = (score) => Number(score || 0).toFixed(1)

export const getRiskInsight = (riskScore) => {
  if (!riskScore) {
    return 'No risk indicators recorded yet'
  }

  const academicScore = Number(riskScore.academic_score || 0)
  const behavioralScore = Number(riskScore.behavioral_score || 0)

  if (academicScore >= 30 && behavioralScore >= 15) {
    return 'Combined academic and behavior concerns'
  }

  if (academicScore >= behavioralScore && academicScore > 0) {
    return 'Low academic performance'
  }

  if (behavioralScore > academicScore && behavioralScore > 0) {
    return 'Frequent violations'
  }

  return 'Stable academic and behavior indicators'
}
