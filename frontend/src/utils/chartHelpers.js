import { normalizeRiskLevel } from './risk'

export const chartHelpers = {
  formatChartData: (students) => {
    const riskLevels = { low: 0, medium: 0, high: 0 }
    const academicScores = []
    const behavioralScores = []

    students.forEach((student) => {
      if (student.riskScore) {
        riskLevels[normalizeRiskLevel(student.riskScore.risk_level)]++
        academicScores.push(student.riskScore.academic_score)
        behavioralScores.push(student.riskScore.behavioral_score)
      }
    })

    return {
      riskDistribution: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        data: [riskLevels.low, riskLevels.medium, riskLevels.high],
      },
      averageAcademicScore:
        academicScores.length > 0
          ? (academicScores.reduce((a, b) => a + b, 0) / academicScores.length).toFixed(2)
          : 0,
      averageBehavioralScore:
        behavioralScores.length > 0
          ? (behavioralScores.reduce((a, b) => a + b, 0) / behavioralScores.length).toFixed(2)
          : 0,
    }
  },

  exportToCSV: (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map((row) => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  },
}
