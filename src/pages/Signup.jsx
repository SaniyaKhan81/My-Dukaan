import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { UNIVERSITIES } from '../data/constants'
import Notification from '../components/Notification'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    university: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    if (!formData.university) {
      setError('Please select your university')
      return
    }

    setSubmitting(true)
    try {
      await signup(formData)
      setSuccess(`Welcome ${formData.name}! Your account has been created.`)
      setTimeout(() => navigate('/marketplace'), 1500)
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Notification
        message={success || error}
        type={success ? 'success' : 'error'}
        onClose={() => { setSuccess(''); setError('') }}
      />
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="bg-gradient-primary p-3 rounded-full shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" name="name" type="text" required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                placeholder="Ahmed Khan" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                placeholder="you@ned.edu.pk" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
              <input id="studentId" name="studentId" type="text" required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                placeholder="24SP-038-CS" value={formData.studentId} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">University</label>
              <select id="university" name="university" required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                value={formData.university} onChange={handleChange}>
                <option value="">Select your university</option>
                {UNIVERSITIES.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                value={formData.password} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
                value={formData.confirmPassword} onChange={handleChange} />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
            )}
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-primary hover:shadow-lg disabled:opacity-70">
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
