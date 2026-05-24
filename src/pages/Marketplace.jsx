import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, ShoppingBag, DollarSign, User, BookOpen } from 'lucide-react'

export default function Marketplace() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedUni, setSelectedUni] = useState('All') // NEW: Uni Filter

  const categories = ['All', 'Mathematics', 'Physics', 'Computer Science', 'Chemistry', 'Biology', 'Other']
  const universities = ['All', 'Stanford', 'MIT', 'Global'] // Match your seeder data

  useEffect(() => {
    // Fetching from your Node/Express + MongoDB backend
    fetch('http://localhost:5000/api/resources')
      .then(res => res.json())
      .then(data => {
        setResources(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setLoading(false)
      })
  }, [])

  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' || resource.category === selectedCategory

    const matchesUni = 
      selectedUni === 'All' || resource.university === selectedUni

    return matchesSearch && matchesCategory && matchesUni
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dukaan Marketplace</h1>
          <p className="text-gray-600">Find university-specific resources for your courses</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by course code or title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Uni Filter */}
            <div className="flex items-center space-x-2">
              <BookOpen className="text-gray-400 h-5 w-5" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                value={selectedUni}
                onChange={(e) => setSelectedUni(e.target.value)}
              >
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
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

        {loading ? (
          <p className="text-center text-gray-500">Connecting to MongoDB...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <Link
                key={resource._id} // FIX: Using MongoDB _id
                to={`/checkout/${resource._id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-indigo-50 hover:border-indigo-300 transform hover:-translate-y-1"
              >
                <div className="h-40 bg-indigo-50 flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-indigo-300" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                    <div className="flex items-center text-green-600 font-bold">
                      <DollarSign className="h-4 w-4" />
                      <span>{resource.price}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {resource.title}
                  </h3>
                  
                  {/* Showing University & Course Code */}
                  <p className="text-indigo-600 text-sm font-medium mb-3">
                    {resource.university} • {resource.courseCode}
                  </p>

                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>Seller: {resource.sellerName || 'Verified Student'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No resources found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}