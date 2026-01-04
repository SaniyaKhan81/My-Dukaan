import { useParams, Link } from 'react-router-dom'
import { Store, DollarSign, ShoppingBag, User } from 'lucide-react'

// Mock data - replace with actual API calls
const mockStorefronts = {
  '1': {
    id: 1,
    name: 'John\'s Study Resources',
    description: 'Quality solved assignments and study materials for students',
    seller: 'John Doe',
    items: [
      {
        id: 1,
        title: 'Calculus I Solved Assignments',
        description: 'Complete solutions for all Calculus I assignments',
        price: 15.99,
        category: 'Mathematics',
      },
      {
        id: 2,
        title: 'Physics Lab Reports',
        description: 'Detailed lab reports for Physics 101',
        price: 12.50,
        category: 'Physics',
      },
    ],
  },
}

export default function Storefront() {
  const { id } = useParams()
  const storefront = mockStorefronts[id] || mockStorefronts['1']

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Storefront Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-primary p-4 rounded-lg shadow-lg">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{storefront.name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>{storefront.seller}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600">{storefront.description}</p>
        </div>

        {/* Items Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storefront.items.map(item => (
              <Link
                key={item.id}
                to={`/checkout/${item.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-purple-100 hover:border-primary-300 transform hover:-translate-y-1"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary-700 bg-gradient-to-r from-primary-100 to-purple-100 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <div className="flex items-center text-primary-700 font-bold">
                      <DollarSign className="h-4 w-4" />
                      <span>{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

