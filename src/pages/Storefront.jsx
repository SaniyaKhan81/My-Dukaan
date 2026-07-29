import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Store, ShoppingBag, User } from 'lucide-react'
import { formatPKR } from '../data/constants'
import { apiFetch } from '../utils/api'

export default function Storefront() {
  const { id } = useParams()
  const [storefront, setStorefront] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch(`/api/storefront/${id}`)
      .then(setStorefront)
      .catch(() => setStorefront(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>
  }

  if (!storefront) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Storefront not found</p>
        </div>
      </div>
    )
  }

  const { user, resources } = storefront

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-primary p-4 rounded-lg shadow-lg">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}'s Resources</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>{user.university} &bull; {user.studentId}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Items</h2>
          {resources.length === 0 ? (
            <p className="text-gray-500">No items listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map(item => (
                <Link key={item._id} to={`/checkout/${item._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border hover:border-primary-300">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="text-primary-700 font-bold text-sm">{formatPKR(item.price)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.university} &bull; {item.courseCode}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
