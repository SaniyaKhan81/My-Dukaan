import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, ShoppingBag, DollarSign, User } from 'lucide-react'

// Mock data - replace with actual API calls
const mockResources = [
  {
    id: 1,
    title: 'Calculus I Solved Assignments',
    description: 'Complete solutions for all Calculus I assignments from Fall 2023',
    price: 15.99,
    seller: 'John Doe',
    category: 'Mathematics',
    image: 'https://via.placeholder.com/300x200?text=Calculus',
  },
  {
    id: 2,
    title: 'Physics Lab Reports',
    description: 'Detailed lab reports for Physics 101 with diagrams and analysis',
    price: 12.50,
    seller: 'Jane Smith',
    category: 'Physics',
    image: 'https://via.placeholder.com/300x200?text=Physics',
  },
  {
    id: 3,
    title: 'Computer Science Algorithms',
    description: 'Solved algorithm problems with explanations and time complexity analysis',
    price: 20.00,
    seller: 'Mike Johnson',
    category: 'Computer Science',
    image: 'https://via.placeholder.com/300x200?text=Algorithms',
  },
  {
    id: 4,
    title: 'Chemistry Study Guide',
    description: 'Comprehensive study guide for Organic Chemistry with practice problems',
    price: 18.75,
    seller: 'Sarah Wilson',
    category: 'Chemistry',
    image: 'https://via.placeholder.com/300x200?text=Chemistry',
  },
]

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Mathematics', 'Physics', 'Computer Science', 'Chemistry', 'Biology', 'Other']

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">Browse and purchase student resources</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Link
              key={resource.id}
              to={`/checkout/${resource.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-purple-100 hover:border-primary-300 transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary-700 bg-gradient-to-r from-primary-100 to-purple-100 px-2 py-1 rounded">
                    {resource.category}
                  </span>
                  <div className="flex items-center text-primary-700 font-bold">
                    <DollarSign className="h-4 w-4" />
                    <span>{resource.price.toFixed(2)}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  <span>{resource.seller}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No resources found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

