import { Link } from 'react-router-dom'
import { ShoppingBag, Upload, Store, TrendingUp, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to My Dukaan
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              The Student-Friendly Marketplace for Resources & Storefronts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/marketplace"
                className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Browse Marketplace
              </Link>
              <Link
                to="/signup"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all border-2 border-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Why Choose My Dukaan?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-purple-100 hover:border-primary-300 transform hover:-translate-y-1">
              <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Easy Upload</h3>
              <p className="text-gray-600">
                Upload your solved assignments, worksheets, and resources in minutes. Set your price and start earning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-purple-100 hover:border-primary-300 transform hover:-translate-y-1">
              <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Your Storefront</h3>
              <p className="text-gray-600">
                Create your own storefront to showcase all your resources and build your student business.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-purple-100 hover:border-primary-300 transform hover:-translate-y-1">
              <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure Payments</h3>
              <p className="text-gray-600">
                Safe and secure online payment system. Get paid instantly when students purchase your resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account as a student seller or buyer
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Upload or Browse</h3>
              <p className="text-gray-600">
                Upload your resources or browse the marketplace for what you need
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Buy or Sell</h3>
              <p className="text-gray-600">
                Complete secure transactions and start learning or earning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of students buying and selling resources
          </p>
          <Link
            to="/signup"
            className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  )
}

