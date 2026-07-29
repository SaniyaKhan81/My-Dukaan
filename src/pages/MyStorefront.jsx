import { Link } from 'react-router-dom'
import { Store, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatPKR } from '../data/constants'
import { apiFetch } from '../utils/api'

export default function MyStorefront() {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchResources = () => {
    apiFetch('/api/resources/my')
      .then(setResources)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchResources() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource? The file will also be removed from the server.')) return
    try {
      await apiFetch(`/api/resources/${id}`, { method: 'DELETE' })
      setResources(resources.filter(r => r._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-4 rounded-lg shadow-lg">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}'s Storefront</h1>
                <p className="text-gray-600 mt-1">{user?.university} &bull; {user?.studentId}</p>
              </div>
            </div>
            <Link to="/upload"
              className="bg-gradient-primary text-white px-6 py-2 rounded-lg hover:shadow-lg flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Item</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-primary-700">{resources.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Listed Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPKR(resources.reduce((sum, r) => sum + r.price, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Items</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't uploaded any items yet.</p>
              <Link to="/upload" className="inline-block bg-gradient-primary text-white px-6 py-2 rounded-lg">
                Upload Your First Item
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map(item => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        <span className="text-xs font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span className="font-semibold">{formatPKR(item.price)}</span>
                        <span>{item.university} &bull; {item.courseCode}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(item._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
