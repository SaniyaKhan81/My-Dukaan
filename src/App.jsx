import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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
            <Route path="/upload" element={<UploadResource />} />
            <Route path="/my-storefront" element={<MyStorefront />} />
            <Route path="/storefront/:id" element={<Storefront />} />
            <Route path="/checkout/:resourceId" element={<Checkout />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

