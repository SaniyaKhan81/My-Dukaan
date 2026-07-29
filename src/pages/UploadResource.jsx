import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { UNIVERSITIES, COURSES, API_BASE } from '../data/constants'
import { apiFetch } from '../utils/api'

export default function UploadResource() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    courseCode: '',
    university: user?.university || '',
    price: '',
    file: null,
  })
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'category') {
      const course = COURSES.find(c => c.name === value)
      setFormData({ ...formData, category: value, courseCode: course?.code || '' })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, file })
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('category', formData.category)
    data.append('price', formData.price)
    data.append('university', formData.university)
    data.append('courseCode', formData.courseCode)
    data.append('file', formData.file)

    try {
      await apiFetch('/api/resources', { method: 'POST', body: data })
      alert('Resource uploaded successfully!')
      navigate('/marketplace')
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload a Resource</h1>
          <p className="text-gray-500 mb-6">Uploading as <strong>{user?.name}</strong> from <strong>{user?.university}</strong></p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Resource Title *</label>
              <input type="text" id="title" name="title" required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., CSC-201 DSA Midterm Notes"
                value={formData.title} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea id="description" name="description" required rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Describe what's included..."
                value={formData.description} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Course / Subject *</label>
                <select id="category" name="category" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={formData.category} onChange={handleChange}>
                  <option value="">Select a course</option>
                  {COURSES.map(c => (
                    <option key={c.code} value={c.name}>{c.code} — {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">University *</label>
                <select id="university" name="university" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={formData.university} onChange={handleChange}>
                  <option value="">Select university</option>
                  {UNIVERSITIES.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price (PKR) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">Rs.</span>
                <input type="number" id="price" name="price" required min="50" step="50"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="500"
                  value={formData.price} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">Upload File *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div>
                      <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      <button type="button" onClick={() => { setPreview(null); setFormData({ ...formData, file: null }) }}
                        className="mt-2 text-sm text-red-600">Remove</button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <label htmlFor="file" className="cursor-pointer text-primary-600 font-medium">
                        Upload a file
                        <input id="file" name="file" type="file" required className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" />
                      </label>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, JPG, PNG up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => navigate('/marketplace')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg disabled:opacity-70">
                {submitting ? 'Uploading...' : 'Upload Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
