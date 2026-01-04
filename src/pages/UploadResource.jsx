import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, DollarSign } from 'lucide-react'

export default function UploadResource() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    file: null,
  })
  const [preview, setPreview] = useState(null)
  const navigate = useNavigate()

  const categories = ['Mathematics', 'Physics', 'Computer Science', 'Chemistry', 'Biology', 'Other']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        file: file,
      })
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement actual file upload and API call
    console.log('Upload resource:', formData)
    alert('Resource uploaded successfully! (This is a demo)')
    navigate('/marketplace')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload a Resource</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Resource Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Calculus I Solved Assignments"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your resource in detail..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null)
                          setFormData({ ...formData, file: null })
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>Upload a file</span>
                          <input
                            id="file"
                            name="file"
                            type="file"
                            required
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, JPG, PNG up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Upload Resource
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

