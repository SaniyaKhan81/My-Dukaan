import { Link } from 'react-router-dom'
import { Store, Plus, Edit, Trash2, DollarSign, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

// Mock data - replace with actual API calls
const mockStorefront = {}

export default function MyStorefront() {
  const [storefront, setStorefront] = useState(mockStorefront)

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setStorefront({
        ...storefront,
        items: storefront.items.filter(item => item.id !== id),
      })
    }
  }

  const totalRevenue = storefront.items.reduce((sum, item) => sum + (item.price * item.sales), 0)
  const totalSales = storefront.items.reduce((sum, item) => sum + item.sales, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Storefront Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-4 rounded-lg shadow-lg">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{storefront.name}</h1>
                <p className="text-gray-600 mt-1">{storefront.description}</p>
              </div>
            </div>
            <Link
              to="/upload"
              className="bg-gradient-primary text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Item</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-4 rounded-lg border border-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-primary-700">{storefront.items.length}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    <DollarSign className="inline h-5 w-5" />
                    {totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Storefront Items */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Items</h2>
          
          {storefront.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't uploaded any items yet.</p>
              <Link
                to="/upload"
                className="inline-block bg-gradient-primary text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Upload Your First Item
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {storefront.items.map(item => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        <span className="text-xs font-semibold text-primary-700 bg-gradient-to-r from-primary-100 to-purple-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{item.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          <span>{item.sales} sales</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
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

