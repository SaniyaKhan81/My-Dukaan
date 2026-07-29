import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Marketplace from './pages/Marketplace'
import UploadResource from './pages/UploadResource'
import MyStorefront from './pages/MyStorefront'
import Storefront from './pages/Storefront'
import Checkout from './pages/Checkout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/upload" element={<ProtectedRoute><UploadResource /></ProtectedRoute>} />
            <Route path="/my-storefront" element={<ProtectedRoute><MyStorefront /></ProtectedRoute>} />
            <Route path="/checkout/:resourceId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/storefront/:id" element={<Storefront />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

