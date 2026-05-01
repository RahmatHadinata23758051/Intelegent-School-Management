import { studentService } from './apiService'

export const dashboardStatisticsService = {
  getStudentStatistics: async () => {
    try {
      const response = await studentService.getAll()
      const students = response.data.data

      const riskStats = {
        high: students.filter((s) => s.riskScore?.risk_level === 'high').length,
        medium: students.filter((s) => s.riskScore?.risk_level === 'medium').length,
        low: students.filter((s) => s.riskScore?.risk_level === 'low').length,
        total: students.length,
      }

      const averageRiskScore =
        students.length > 0
          ? (students.reduce((sum, s) => sum + (s.riskScore?.total_score || 0), 0) /
              students.length)
          : 0

      return {
        riskStats,
        averageRiskScore: averageRiskScore.toFixed(2),
        totalStudents: students.length,
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
      return null
    }
  },
}
