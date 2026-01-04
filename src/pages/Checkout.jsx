import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { DollarSign, Lock, CreditCard, CheckCircle } from 'lucide-react'

// Mock data - replace with actual API calls
const mockResources = {
  '1': {
    id: 1,
    title: 'Calculus I Solved Assignments',
    description: 'Complete solutions for all Calculus I assignments from Fall 2023',
    price: 15.99,
    seller: 'John Doe',
    category: 'Mathematics',
  },
  '2': {
    id: 2,
    title: 'Physics Lab Reports',
    description: 'Detailed lab reports for Physics 101 with diagrams and analysis',
    price: 12.50,
    seller: 'Jane Smith',
    category: 'Physics',
  },
}

export default function Checkout() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const resource = mockResources[resourceId] || mockResources['1']
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    // Format card number
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      setPaymentData({ ...paymentData, [name]: formatted })
    } else if (name === 'expiryDate') {
      // Format expiry date
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
      setPaymentData({ ...paymentData, [name]: formatted })
    } else {
      setPaymentData({ ...paymentData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // TODO: Implement actual payment processing (Stripe, PayPal, etc.)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setIsComplete(true)
    
    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/marketplace')
    }, 3000)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your purchase has been completed.</p>
          <p className="text-sm text-gray-500">Redirecting to marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{resource.category}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${resource.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">${resource.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Secure Payment</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      required
                      maxLength="19"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      required
                      maxLength="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      required
                      maxLength="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is a demo payment form. In production, integrate with a secure payment gateway like Stripe or PayPal.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      <span>Pay ${resource.price.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

