import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Upload, Store, LogIn, UserPlus, LogOut, Home } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false) // TODO: Replace with actual auth state
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsAuthenticated(false)
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-1.5 rounded-lg shadow-md group-hover:shadow-lg transition-all">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">My Dukaan</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/marketplace"
              className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Marketplace</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/upload"
                  className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
                <Link
                  to="/my-storefront"
                  className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
                >
                  <Store className="h-4 w-4" />
                  <span>My Storefront</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center space-x-1"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link
              to="/marketplace"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingBag className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

