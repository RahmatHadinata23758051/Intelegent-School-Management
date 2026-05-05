import React, { useState, useEffect } from 'react'
import { classService } from '../services/apiService'

export const ClassesPage = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    grade_level: '',
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await classService.getAll()
      setClasses(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await classService.create(formData)
      setFormData({ name: '', grade_level: '' })
      setShowForm(false)
      fetchClasses()
    } catch (error) {
      console.error('Failed to create class:', error)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Classes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New Class'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Class Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Grade Level"
              value={formData.grade_level}
              onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button type="submit" className="btn-primary mt-4">
            Create Class
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((schoolClass) => (
            <div key={schoolClass.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {schoolClass.name}
              </h3>
              <p className="text-gray-600 mb-4">Grade: {schoolClass.grade_level}</p>
              {schoolClass.students && (
                <p className="text-sm text-gray-500">
                  {schoolClass.students.length} students
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
