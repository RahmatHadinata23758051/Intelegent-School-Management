import { studentService } from './apiService'
import { extractApiData } from '../utils/errors'

export const dashboardStatisticsService = {
  getStudentStatistics: async () => {
    const response = await studentService.getStatistics()
    return extractApiData(response)
  },
}
